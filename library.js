'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const meta = require.main.require('./src/meta');
const translator = require.main.require('./src/translator');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware /* , controllers */ } = params;
	const accountMiddlewares = [
		middleware.exposeUid,
		middleware.ensureLoggedIn,
		middleware.canViewUsers,
		middleware.checkAccountPermissions,
	];

	routeHelpers.setupPageRoute(router, '/user/:userslug/ntfy', accountMiddlewares, controllers.renderSettings);

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/ntfy', [], controllers.renderAdminPage);
};

plugin.addRoutes = async ({ router, middleware, helpers }) => {
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

module.exports = plugin;
