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
};

plugin.addRoutes = async ({ router, middleware }) => {
	const middlewares = [
		middleware.ensureLoggedIn,
	];

	routeHelpers.setupApiRoute(router, 'post', '/ntfy/regenerate', middlewares, controllers.regenerateTopic);
	routeHelpers.setupApiRoute(router, 'post', '/ntfy/test', middlewares, controllers.sendTestNotification);
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

plugin.onNotificationPush = async ({ notification, uidsNotified: uids }) => {
	let topics = (await user.getUsersFields(uids, ['ntfyTopic'])).map(obj => obj.ntfyTopic);
	uids = uids.filter((_, idx) => topics[idx]);
	topics = topics.filter(Boolean);
	const userSettings = await user.getMultipleUserSettings(uids);

	const payloads = await Promise.all(uids.map(async (uid, idx) => {
		let [Title, body] = await translator.translateKeys(
			[notification.bodyShort, notification.bodyLong],
			userSettings[idx].userLang
		);
		([Title, body] = [Title, body].map(str => validator.unescape(utils.stripHTMLTags(str))));
		const Click = `${nconf.get('url')}${notification.path}`;

		// Handle empty bodyLong
		if (!notification.bodyLong) {
			body = Title;
			Title = meta.config.title || 'NodeBB';
		}

		return {
			body,
			headers: {
				Title,
				Click,
			},
		};
	}));

	try {
		await Promise.all(topics.map(async (topic, idx) => ntfy.send(topic, payloads[idx])));
	} catch (err) {
		console.error(err.stack);
	}
};

module.exports = plugin;
