'use strict';

const fetch = require('node-fetch');

// const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');
const user = require.main.require('./src/user');

const ntfy = module.exports;

ntfy.getTopic = async (uid) => {
	const name = await user.getUserField(uid, 'ntfyTopic');
	return name || await ntfy.regenerateTopic(uid);
};

ntfy.regenerateTopic = async (uid) => {
	const name = await utils.generateUUID();
	await user.setUserField(uid, 'ntfyTopic', name);

	return name;
};

ntfy.send = async (topic, payload) => {
	fetch(`https://ntfy.sh/${topic}`, {
		method: 'POST',
		...payload,
	});
};
