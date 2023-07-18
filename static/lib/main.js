'use strict';

(async () => {
	const hooks = await app.require('hooks');

	hooks.on('filter:script.load', ({ tpl_url, scripts }) => {
		if (tpl_url === 'account/ntfy-v2') {
			scripts.splice(scripts.indexOf('forum/account/ntfy-v2'), 1, 'forum/account/ntfy');
		}

		return { tpl_url, scripts };
	});
})();
