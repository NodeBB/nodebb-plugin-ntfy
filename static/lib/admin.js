/* eslint-disable import/no-unresolved */

'use strict';

import { save, load } from 'settings';
import { render } from 'benchpress';

// eslint-disable-next-line import/prefer-default-export
export async function init() {
	load('ntfy', $('.ntfy-settings'), () => {
		// settings.load shoves all the values into the first association input, so
		// the roles all start out disabled so that they don't get overridden
		const fieldset = document.getElementById('notifyTags');
		const diabledEls = fieldset.querySelectorAll('input[disabled]');
		diabledEls.forEach((el) => {
			el.disabled = false;
		});
	});
	$('#save').off('click').on('click', saveSettings);
	handleNotifyTags();
}

function saveSettings() {
	save('ntfy', $('.ntfy-settings'));
}

function handleNotifyTags() {
	if (ajaxify.data.version === '2') {
		return;
	}

	const addEl = document.querySelector('[data-action="add"]');
	const fieldset = document.getElementById('notifyTags');
	if (!addEl || !fieldset) {
		return;
	}

	addEl.addEventListener('click', async () => {
		let html = await render('partials/notifyTags-field', {
			groupNames: ajaxify.data.groupNames,
		});
		html = new DOMParser().parseFromString(html, 'text/html').body.childNodes;
		html.forEach((el) => {
			el.querySelectorAll('input[disabled]').forEach((el) => {
				el.disabled = false;
			});
		});
		fieldset.append(...html);
	});

	fieldset.addEventListener('click', (e) => {
		const subselector = e.target.closest('[data-action="remove"]');
		if (!subselector) {
			return;
		}

		const row = subselector.closest('.association');
		row.remove();
	});
}
