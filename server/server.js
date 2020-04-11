const bodyParser = require('body-parser');
const archiver = require('archiver');
const express = require('express');
const cfonts = require('cfonts');
const https = require('https');
const path = require('path');
require('dotenv').config();

const { blender } = require('../lib/index.js');
const propTypes = require('./prop-types.json');

// SETTINGS
const slackUrls = JSON.parse(process.env.SLACKURLS);
const PORT = 1337;
const BLENDERURL = '/blender';
const DSURL = 'https://gel.westpacgroup.com.au/design-system';

// SERVER
const server = express();
server
	.use(express.static('.')) // TODO this will go in production
	.get('*', (request, response) => {
		response.redirect(301, DSURL);
	})
	.use(bodyParser.urlencoded({ extended: true }))
	.listen(PORT, async () => {
		console.log();
		cfonts.say('blender', {
			gradient: ['red', 'cyan'],
			font: 'tiny',
			space: false,
		});

		try {
			const version = await blender({ version: true });
			console.log(` ${version} started at http://localhost:${PORT}\n`);
		} catch (error) {
			console.error(error);
		}
	});

server.post(BLENDERURL, async (request, response) => {
	const cleanReq = sanitizeRequest(request, propTypes);

	const brand = cleanReq.brand || 'wbc';
	const packages = [...cleanReq.packages, 'core', `${brand}`];
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
					{ type: 'mrkdwn', text: `Modules: \`${cleanReq.modules}\`` },
					{ type: 'mrkdwn', text: `Prettify: \`${cleanReq.prettify}\`` },
					{ type: 'mrkdwn', text: `jQuery: \`${cleanReq.excludeJquery}\`` },
					{ type: 'mrkdwn', text: `Classes: \`${cleanReq.noVersionInClass}\`` },
					{ type: 'mrkdwn', text: `Tokens: \`${cleanReq.tokensFormat}\`` },
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
			modules: cleanReq.modules,
			prettify: cleanReq.prettify,
			excludeJquery: cleanReq.excludeJquery,
			noVersionInClass: cleanReq.noVersionInClass,
			tokensFormat: cleanReq.tokensFormat,
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
	if (result.files) {
		result.files.map(([_, { name, filePath, dir, content }]) => {
			archive.append(content, { name: `${dir.slice(prefix.length)}/${filePath}/${name}` }, 'utf-8');
		});
	}

	response.writeHead(200, {
		'Content-Type': `application/zip`,
		'Content-disposition': `attachment; filename=GUI-blend-${brand}.zip`,
	});

	// finish off zip process
	archive.finalize();

	// report in slack
	// send2Slack(slackMsg, slackUrls);

	// TODO log output to console.log for log files
});

/**
 * Sanitize request by white-listing each item
 *
 * @param  {object} request - The express request object
 * @param  {object} allPkgs - An object of all packages
 *
 * @return {object}         - A flat object with only those keys which are allowed
 */
function sanitizeRequest(request, allPkgs) {
	cleanReq = {};
	const pkgDict = Object.keys(allPkgs);

	cleanReq.packages = request.body.packages.filter((pkg) => pkgDict.includes(pkg));
	cleanReq.brand = request.body.brand;
	cleanReq.modules = !!request.body.modules;
	cleanReq.prettify = !!request.body.prettify;
	cleanReq.excludeJquery = !!request.body.excludeJquery;
	cleanReq.noVersionInClass = !!request.body.noVersionInClass;
	cleanReq.tokensFormat = request.body.tokensFormat;

	return cleanReq;
}

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

		const postRequest = https
			.request(options, (response) => {
				console.log('Status Code:', response.statusCode);
			})
			.on('error', (error) => {
				console.log('Error: ', error.message);
			});

		postRequest.write(body);
		postRequest.end();
	});
}
