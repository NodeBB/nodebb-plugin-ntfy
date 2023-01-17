'use strict';

const nconf = require.main.require('nconf');

const user = require.main.require('./src/user');
const translator = require.main.require('./src/translator');
const accountHelpers = require.main.require('./src/controllers/accounts/helpers');
const helpers = require.main.require('./src/controllers/helpers');

const ntfy = require('./ntfy');

const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/ntfy', {});
};

Controllers.renderSettings = async function (req, res, next) {
	const userData = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, req.query);
	if (!userData) {
		return next();
	}

	userData.ntfyTopic = await ntfy.getTopic(req.uid);
	userData.ntfyUrl = `${res.locals.useragent.isMobile ? 'ntfy' : 'https'}://ntfy.sh/${userData.ntfyTopic}`;

	userData.title = '[[ntfy:profile.label]]';
	userData.breadcrumbs = helpers.buildBreadcrumbs([{ text: userData.username, url: `/user/${userData.userslug}` }, { text: userData.title }]);

	res.render('account/ntfy', userData);
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
