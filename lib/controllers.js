'use strict';

const nconf = require.main.require('nconf');

const helpers = require.main.require('./src/controllers/helpers');
const accountHelpers = require.main.require('./src/controllers/accounts/helpers');

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

	await ntfy.send(topic, {
		body: 'If you are receiving this, then that means push notifications are successfully set up on this device.',
		headers: {
			Title: 'Test Notification',
			Tags: 'white_check_mark',
			Click: `${nconf.get('url')}/me/ntfy`,
		},
	});
	helpers.formatApiResponse(202, res);
};
