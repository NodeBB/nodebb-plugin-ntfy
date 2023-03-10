'use strict';

const path = require('path');
const fs = require('fs').promises;

const fetch = require('node-fetch');

const nconf = require.main.require('nconf');

const utils = require.main.require('./src/utils');
const user = require.main.require('./src/user');
const slugify = require.main.require('./src/slugify');

const ntfy = module.exports;

ntfy.getUserAgent = async () => {
	if (ntfy._userAgent) {
		return ntfy._userAgent;
	}

	const pkg = path.resolve(__dirname, '../package.json');
	const { version } = JSON.parse(await fs.readFile(pkg));

	ntfy._userAgent = `nodebb-plugin-ntfy/${version}`;
	return ntfy.getUserAgent();
};

ntfy.getTopic = async (uid) => {
	const name = await user.getUserField(uid, 'ntfyTopic');
	return name || await ntfy.regenerateTopic(uid);
};

ntfy.regenerateTopic = async (uid) => {
	const [{ hostname }, uuid, userslug] = await Promise.all([
		nconf.get('url_parsed'),
		utils.generateUUID().slice(0, 8),
		user.getUserField(uid, 'userslug'),
	]);
	const name = `${slugify(hostname)}-${userslug}-${uuid}`;
	await user.setUserField(uid, 'ntfyTopic', name);

	return name;
};

ntfy.send = async (topics, payload) => {
	if (typeof topics === 'string') {
		topics = [topics];
	}

	// Remove invalid characters from headers
	const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
	if (payload.headers) {
		Object.keys(payload.headers).forEach((prop) => {
			payload.headers[prop] = payload.headers[prop].replace(invalidHeaderCharRegex, '');
		});
	}

	payload.headers['User-Agent'] = await ntfy.getUserAgent();

	await Promise.all(topics.map(async (topic) => {
		await fetch(`https://ntfy.sh/${topic}`, {
			method: 'POST',
			...payload,
		});
	}));
};
