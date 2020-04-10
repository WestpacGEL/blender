const bodyParser = require('body-parser');
const archiver = require('archiver');
const express = require('express');
const https = require('https');
const path = require('path');
require('dotenv').config();

const { blender } = require('../lib/index.js');

const slackUrls = JSON.parse(process.env.SLACKURLS);

const server = express();
server
	.use(express.static('.')) // TODO this will go in production
	// TODO add 301 for non post requests
	.use(bodyParser.urlencoded({ extended: true }))
	.post('/blender', async (request, response) => {
		// TODO check blender endpoint path
		// TODO check and sanitize request data

		const brand = request.body.brand || 'wbc';
		const packages = [...request.body.packages, 'core', `${brand}`];
		const prefix = 'zip';
		const IP = request.headers[`x-forwarded-for`] || request.connection.remoteAddress || '';
		const slackMsg = {
			blocks: [
				{
					type: 'context',
					elements: [
						{
							type: 'mrkdwn',
							text: `IP: *${IP}*`,
						},
					],
				},
				{
					type: 'section',
					text: {
						text: `The *Blender* has send another zip at _${new Date().toISOString()}_`,
						type: 'mrkdwn',
					},
				},
				{
					type: 'divider',
					block_id: 'divider1',
				},
				{
					type: 'section',
					text: {
						text: '*Packages*',
						type: 'mrkdwn',
					},
					fields: packages.map((pkg) => ({ type: 'plain_text', text: pkg })),
				},
				{
					type: 'section',
					text: {
						text: '*Options*',
						type: 'mrkdwn',
					},
					fields: [
						{ type: 'mrkdwn', text: `Modules: \`${!!request.body.modules}\`` },
						{ type: 'mrkdwn', text: `Prettify: \`${!!request.body.prettify}\`` },
						{ type: 'mrkdwn', text: `jQuery: \`${!!request.body.jquery}\`` },
						{ type: 'mrkdwn', text: `Classes: \`${!!request.body.classes}\`` },
						{ type: 'mrkdwn', text: `Tokens: \`${request.body.tokens}\`` },
					],
				},
			],
		};
		let result;

		try {
			result = await blender({
				cwd: path.normalize(`${__dirname}/../tests/mock/mock-project2/`),
				brand: `@westpac/${brand}`,
				scope: '',
				modules: !!request.body.modules,
				prettify: !!request.body.prettify,
				jquery: !!request.body.jquery,
				'no-version-in-class': !!request.body.classes,
				'tokens-format': request.body.tokens,
				output: prefix,
				include: packages.map((pkg) => `@westpac/${pkg}`),
			});
		} catch (error) {
			response
				.status(500)
				.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
		}

		// create an archiver instance
		const archive = archiver('zip');

		archive
			.on('warning', (error) => {
				// catch warnings
				if (err.code === 'ENOENT') {
					console.error(`Could not find file or directory: ${error}`);
				} else {
					response
						.status(500)
						.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
				}
			})
			.on('error', (error) => {
				// catch errors
				response
					.status(500)
					.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
			})
			// pipe output to our server response
			.pipe(response);

		// append each file to the zip
		result.files.map(([_, { name, filePath, dir, content }]) => {
			archive.append(content, { name: `${dir.slice(prefix.length)}/${filePath}/${name}` }, 'utf-8');
		});

		response.writeHead(200, {
			'Content-Type': `application/zip`,
			'Content-disposition': `attachment; filename=GUI-blend-${brand}.zip`,
		});

		// finish off zip process
		archive.finalize();

		// report in slack
		send2Slack(slackMsg);

		// TODO log output to console.log for log files
	});

server.listen(1337, () => console.log('Server listening at http://localhost:1337'));

/**
 * Send a message to slack
 *
 * @param  {object} body      - The body of the message
 * @param  {array}  slackUrls - The url of the slack incoming webhook
 *
 * @return {void}
 */
function send2Slack(body, slackUrls) {
	body = JSON.stringify(body);

	slackUrls.map((slackUrl) => {
		const options = {
			hostname: 'hooks.slack.com',
			path: slackUrl,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': body.length,
			},
		};

		const request = https
			.request(options, (response) => {
				console.log('Status Code:', response.statusCode);
			})
			.on('error', (error) => {
				console.log('Error: ', error.message);
			});

		request.write(body);
		request.end();
	});
}
