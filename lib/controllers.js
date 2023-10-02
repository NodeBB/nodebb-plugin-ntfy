'use strict';

const { encode } = require('rfc2047');

const nconf = require.main.require('nconf');

const user = require.main.require('./src/user');
const meta = require.main.require('./src/meta');
const translator = require.main.require('./src/translator');
const helpers = require.main.require('./src/controllers/helpers');

const ntfy = require('./ntfy');

const Controllers = module.exports;

Controllers.renderAdminPage = async (req, res/* , next */) => {
	const main = require('../library');
	const notifyTags = await main.getNotifyTags();
	res.render('admin/plugins/ntfy', {
		title: '[[ntfy:admin.title]]',
		version: nconf.get('version').slice(0, 1),
		notifyTags,
	});
};

Controllers.renderSettings = async function (req, res) {
	if (res.locals.uid !== req.user.uid) {
		return helpers.notAllowed(req, res);
	}

	const { username, userslug } = await user.getUserFields(res.locals.uid, ['username', 'userslug']);
	const { hostname } = await meta.settings.get('ntfy');

	const payload = {};
	payload.ntfyTopic = await ntfy.getTopic(req.uid);
	payload.ntfyUrl = `${res.locals.useragent.isMobile ? 'ntfy' : 'https'}://${hostname || 'ntfy.sh'}/${payload.ntfyTopic}`;

	payload.title = '[[ntfy:profile.label]]';
	payload.breadcrumbs = helpers.buildBreadcrumbs([{ text: username, url: `/user/${userslug}` }, { text: payload.title }]);

	// v2 compatibility
	if (nconf.get('version').startsWith('2')) {
		const v2payload = { ...res.locals.templateValues, ...payload };
		return res.render('account/ntfy-v2', v2payload);
	}

	res.render('account/ntfy', payload);
};

Controllers.regenerateTopic = async (req, res) => {
	const topic = await ntfy.regenerateTopic(req.uid);
	helpers.formatApiResponse(201, res, { topic });
};

Controllers.sendTestNotification = async (req, res) => {
	const topic = await ntfy.getTopic(req.uid);
	const { userLang } = await user.getSettings(req.uid);
	let [Title, body] = await translator.translateKeys(['[[ntfy:test.title]]', '[[ntfy:test.body]]'], userLang);
	Title = encode(Title);

	await ntfy.send(topic, {
		body,
		headers: {
			Title,
			Tags: 'white_check_mark',
			Click: `${nconf.get('url')}/me/ntfy`,
		},
	});
	helpers.formatApiResponse(202, res);
};
