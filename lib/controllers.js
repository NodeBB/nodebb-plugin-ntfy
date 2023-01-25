'use strict';

const nconf = require.main.require('nconf');

const user = require.main.require('./src/user');
const translator = require.main.require('./src/translator');
const helpers = require.main.require('./src/controllers/helpers');

const ntfy = require('./ntfy');

const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/ntfy', {});
};

Controllers.renderSettings = async function (req, res) {
	if (res.locals.uid !== req.user.uid) {
		return helpers.notAllowed(req, res);
	}

	const { username, userslug } = await user.getUserFields(res.locals.uid, ['username', 'userslug']);

	const payload = {};
	payload.ntfyTopic = await ntfy.getTopic(req.uid);
	payload.ntfyUrl = `${res.locals.useragent.isMobile ? 'ntfy' : 'https'}://ntfy.sh/${payload.ntfyTopic}`;

	payload.title = '[[ntfy:profile.label]]';
	payload.breadcrumbs = helpers.buildBreadcrumbs([{ text: username, url: `/user/${userslug}` }, { text: payload.title }]);

	res.render('account/ntfy', payload);
};

Controllers.regenerateTopic = async (req, res) => {
	const topic = await ntfy.regenerateTopic(req.uid);
	helpers.formatApiResponse(201, res, { topic });
};

Controllers.sendTestNotification = async (req, res) => {
	const topic = await ntfy.getTopic(req.uid);
	const { userLang } = await user.getSettings(req.uid);
	const [Title, body] = await translator.translateKeys(['[[ntfy:test.title]]', '[[ntfy:test.body]]'], userLang);

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
