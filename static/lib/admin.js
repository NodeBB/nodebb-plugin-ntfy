/* eslint-disable import/no-unresolved */

'use strict';

import { save, load } from 'settings';

// eslint-disable-next-line import/prefer-default-export
export async function init() {
	load('ntfy', $('.ntfy-settings'));
	$('#save').off('click').on('click', saveSettings);
}

function saveSettings() {
	save('ntfy', $('.ntfy-settings'));
}
