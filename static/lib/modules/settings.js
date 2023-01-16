'use strict';

import { post } from 'api';
import { success } from 'alerts';

// eslint-disable-next-line import/prefer-default-export
export async function init() {
	const containerEl = document.querySelector('.account');

	containerEl.addEventListener('click', async (e) => {
		const subselector = e.target.closest('[data-action]');
		if (subselector) {
			const action = e.target.getAttribute('data-action');

			switch (action) {
				case 'test': {
					await post('/plugins/ntfy/test');
					success('[[ntfy:toast.test_success]]');
					break;
				}

				case 'regenerate': {
					const { topic } = await post('/plugins/ntfy/regenerate');
					document.getElementById('topic').value = topic;
					success('[[ntfy:toast.regenerate_success]]', 2500);
					break;
				}
			}
		}
	});
}
