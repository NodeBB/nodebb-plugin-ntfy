'use strict';

const validator = require('validator');

const nconf = require.main.require('nconf');

const user = require.main.require('./src/user');
const meta = require.main.require('./src/meta');
const translator = require.main.require('./src/translator');
const routeHelpers = require.main.require('./src/routes/helpers');
const utils = require.main.require('./src/utils');

const controllers = require('./lib/controllers');
const ntfy = require('./lib/ntfy');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware /* , controllers */ } = params;
	const accountMiddlewares = [
		middleware.exposeUid,
		middleware.ensureLoggedIn,
		middleware.canViewUsers,
		middleware.checkAccountPermissions,
	];

	// v2 compatibility
	if (!nconf.get('version').startsWith('2')) {
		accountMiddlewares.push(middleware.buildAccountData);
	} else {
		const accountHelpers = require.main.require('./src/controllers/accounts/helpers');
		accountMiddlewares.push(async (req, res, next) => {
			res.locals.templateValues = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, req.query);
			next();
		});
	}

	routeHelpers.setupPageRoute(router, '/user/:userslug/ntfy', accountMiddlewares, controllers.renderSettings);

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/ntfy', [], controllers.renderAdminPage);
};

plugin.addRoutes = async ({ router, middleware }) => {
	const middlewares = [
		middleware.ensureLoggedIn,
	];

	routeHelpers.setupApiRoute(router, 'post', '/ntfy/regenerate', middlewares, controllers.regenerateTopic);
	routeHelpers.setupApiRoute(router, 'post', '/ntfy/test', middlewares, controllers.sendTestNotification);
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/ntfy',
		icon: 'fa-tint',
		name: 'Push Notifications (ntfy)',
	});

	return header;
};

plugin.getNotifyTags = async (returnMap) => {
	let { notifyTags, notifyChannels, notifyEmails } = await meta.settings.get('ntfy');
	if (!notifyTags || !notifyChannels) {
		return [];
	}

	[notifyChannels, notifyTags, notifyEmails] = [notifyChannels, notifyTags, notifyEmails].map(arr => (!Array.isArray(arr) ? arr.split(',') : arr));

	return returnMap ?
		notifyTags.reduce((map, tag, idx) => {
			map.set(tag, {
				channel: notifyChannels[idx],
				email: notifyEmails[idx],
			});
			return map;
		}, new Map()) :
		notifyTags.map((tag, idx) => ({
			tag,
			channel: notifyChannels[idx],
			email: notifyEmails[idx],
		}));
};

plugin.addProfileItem = async (data) => {
	const title = await translator.translate('[[ntfy:profile.label]]');
	data.links.push({
		id: 'ntfy',
		route: 'ntfy',
		icon: 'fa-bell-o',
		name: title,
		visibility: {
			self: true,
			other: false,
			moderator: false,
			globalMod: false,
			admin: false,
		},
	});

	return data;
};

async function constructNtfyPayload({ bodyShort, bodyLong, path }, language, headers = {}) {
	let { maxLength, dropBodyLong } = await meta.settings.get('ntfy');
	maxLength = parseInt(maxLength, 10) || 256;

	if (dropBodyLong === 'on') {
		bodyLong = undefined;
	}

	if (!language) {
		language = meta.config.defaultLang || 'en-GB';
	}

	let [Title, body] = await translator.translateKeys([bodyShort, bodyLong], language);
	([Title, body] = [Title, body].map(str => validator.unescape(utils.stripHTMLTags(str))));
	const Click = `${nconf.get('url')}${path}`;

	// Handle empty bodyLong
	if (!bodyLong) {
		body = Title;
		Title = meta.config.title || 'NodeBB';
	}

	// Truncate body if needed
	if (body.length > maxLength) {
		body = `${body.slice(0, maxLength)}…`;
	}

	return {
		body,
		headers: {
			Title,
			Click,
			...headers,
		},
	};
}

plugin.onNotificationPush = async ({ notification, uidsNotified: uids }) => {
	let topics = (await user.getUsersFields(uids, ['ntfyTopic'])).map(obj => obj.ntfyTopic);
	uids = uids.filter((_, idx) => topics[idx]);
	topics = topics.filter(Boolean);
	const userSettings = await user.getMultipleUserSettings(uids);

	const payloads = await Promise.all(
		uids.map(async (uid, idx) => constructNtfyPayload(notification, userSettings[idx].userLang))
	);

	try {
		await Promise.all(topics.map(async (topic, idx) => ntfy.send(topic, payloads[idx])));
	} catch (err) {
		console.error(err.stack);
	}
};

plugin.onTopicTag = async ({ topic, post }) => {
	const notifyTags = await plugin.getNotifyTags(true);
	if (!notifyTags || !notifyTags.size) {
		return;
	}

	let { title, tags } = topic;
	tags = tags.map(tag => tag.value);
	if (title) {
		title = utils.decodeHTMLEntities(title);
		title = title.replace(/,/g, '\\,');
	}

	const topics = tags
		.map(tag => notifyTags.get(tag))
		.filter(Boolean)
		.filter((tag, idx, source) => source.indexOf(tag) === idx);
	const email = topics
		.map(topic => topic.email)
		.filter(Boolean)
		.filter((tag, idx, source) => source.indexOf(tag) === idx)
		.pop(); // only one email is supported per notification

	if (!topics.length) {
		return;
	}

	const payload = await constructNtfyPayload({
		bodyShort: `[[notifications:user-posted-topic, ${post.user.displayname}, ${title}]]`,
		bodyLong: post.content,
		path: `/post/${post.pid}`,
	}, undefined, {
		'X-Email': email,
	});

	await Promise.all(topics.map(topic => ntfy.send(topic.channel, payload)));
};

module.exports = plugin;
