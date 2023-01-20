/**
 * You can run these tests by executing `npx mocha test/plugins-installed.js`
 * from the NodeBB root folder. The regular test runner will also run these
 * tests.
 *
 * Keep in mind tests do not activate all plugins, so if you are testing
 * hook listeners, socket.io, or mounted routes, you will need to add your
 * plugin to `config.json`, e.g.
 *
 * {
 *     "test_plugins": [
 *         "nodebb-plugin-ntfy"
 *     ]
 * }
 */

'use strict';

const assert = require('assert');
const fetch = require('node-fetch');
const EventSource = require('eventsource');

const db = require.main.require('./test/mocks/databasemock');
const nconf = require.main.require('nconf');
const user = require.main.require('./src/user');
const utils = require.main.require('./src/utils');

const ntfy = require('../lib/ntfy');

describe('nodebb-plugin-ntfy', () => {
	// To prevent spamming ntfy.sh needlessly, specify a single topic for testing purposes
	const testTopic = `nodebb-ntfy-testrunner-${utils.generateUUID()}`;
	const testPayload = {
		body: 'bar',
		headers: {
			Title: 'foo',
		},
	};

	describe('.getTopic()', () => {
		let uid;

		beforeEach(async () => {
			const [username, password] = [utils.generateUUID().slice(0, 10), utils.generateUUID()];
			uid = await user.create({ username, password });
		});

		it('should return a string', async () => {
			const topic = await ntfy.getTopic(uid);
			assert.strictEqual('string', typeof topic);
		});

		it('should return the same topic name if called again', async () => {
			const topic = await ntfy.getTopic(uid);
			const again = await ntfy.getTopic(uid);

			assert.strictEqual(topic, again);
		});
	});

	describe('.regenerateTopic', () => {
		let uid;

		beforeEach(async () => {
			const [username, password] = [utils.generateUUID().slice(0, 10), utils.generateUUID()];
			uid = await user.create({ username, password });
		});

		it('should return a string', async () => {
			const topic = await ntfy.getTopic(uid);
			assert.strictEqual('string', typeof topic);
		});

		it('should generate a new topic name if the user does not have one', async () => {
			let currentTopic = await db.getObjectField(`user:${uid}`, 'ntfyTopic');
			assert.strictEqual(currentTopic, null);

			const topic = await ntfy.getTopic(uid);
			currentTopic = await db.getObjectField(`user:${uid}`, 'ntfyTopic');

			assert(topic);
			assert.strictEqual(currentTopic, topic);
		});

		it('should have the hostname and user slug prefixed to the topic name', async () => {
			const topic = await ntfy.getTopic(uid);
			const userslug = await user.getUserField(uid, 'userslug');

			assert(topic.startsWith(`${nconf.get('url_parsed').hostname}-${userslug}-`));
		});
	});

	describe('.send', () => {
		it('should send a single payload to a single topic', (done) => {
			const eventSource = new EventSource(`https://ntfy.sh/${testTopic}/sse`);
			eventSource.onmessage = ({ data }) => {
				data = JSON.parse(data);
				assert.strictEqual(data.event, 'message');
				assert.strictEqual(data.topic, testTopic);
				assert.strictEqual(data.title, testPayload.headers.Title);
				assert.strictEqual(data.message, testPayload.body);
				eventSource.close();
				done();
			};

			ntfy.send(testTopic, testPayload);
		});

		it('should send a single payload to multiple topics', (done) => {
			const eventSource = new EventSource(`https://ntfy.sh/${testTopic}/sse`);
			let count = 0;
			eventSource.onmessage = ({ data }) => {
				data = JSON.parse(data);
				assert.strictEqual(data.event, 'message');
				assert.strictEqual(data.topic, testTopic);
				assert.strictEqual(data.title, testPayload.headers.Title);
				assert.strictEqual(data.message, testPayload.body);
				count += 1;

				if (count === 2) {
					done();
				}
			};

			ntfy.send([testTopic, testTopic], testPayload);
		});
	});
});
