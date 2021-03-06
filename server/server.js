const bodyParser = require('body-parser');
const archiver = require('archiver');
const express = require('express');
const cfonts = require('cfonts');
const https = require('https');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const { blender } = require('../lib/index.js');

// SETTINGS
const slackUrls = JSON.parse(process.env.SLACKURLS);
const PORT = 1339;
const BLENDERURL = '/api/blender2';
const DSURL = 'https://gel.westpacgroup.com.au/design-system';
const LOGFILE = 'blender.log';
const GEL = require(path.normalize(`${process.env.GEL_PATH}/GEL.json`));

// SERVER
const server = express();
server
	.get('*', (_, response) => {
		response.redirect(301, DSURL);
	})
	.use(bodyParser.urlencoded({ extended: true }))
	.listen(PORT, async () => {
		console.log();
		cfonts.say('blender', {
			font: 'tiny',
			space: false,
		});

		try {
			const version = await blender({ version: true });
			console.log(` ${version} started at http://localhost:${PORT}\n`);
		} catch (error) {
			log.error(error);
		}
	});

server.post(BLENDERURL, async (request, response) => {
	const time = new Date().toISOString();
	const cleanReq = sanitizeRequest(request, GEL);

	// discard invalid requests
	if (!cleanReq) {
		response.status(400).send({ error: 'The request made was invalid' });

		return;
	}

	const IP = request.headers[`x-forwarded-for`] || request.connection.remoteAddress || 'unknown';

	log.incoming(
		`Request received at ${time} from ${IP} with:\n            ${JSON.stringify(cleanReq)}`
	);

	// manually add brand package as that's not something you get to chose in the form
	cleanReq.packages = [...cleanReq.packages, `${cleanReq.brand}`];

	// create a pipe zip
	await createZip({ response, cleanReq, IP });
	log.outgoing(`Zip sent!`);

	// report in slack
	send2Slack({ cleanReq, IP, slackUrls, time });

	// Keep count of each time the blender runs
	counter();
});

/**
 * Get files from blender, zip them up and pipe them to response of server
 *
 * @param  {object} options.response - The express response object
 * @param  {object} options.cleanReq - The clean request object
 *
 * @return {void}
 */
async function createZip({ response, cleanReq }) {
	const prefix = 'zip';
	let result;

	try {
		result = await blender({
			cwd: path.normalize(process.env.GEL_PATH),
			brand: `@westpac/${cleanReq.brand}`,
			scope: '',
			modules: cleanReq.modules,
			prettify: cleanReq.prettify,
			includeJquery: cleanReq.includeJquery,
			versionInClass: cleanReq.versionInClass,
			tokensFormat: cleanReq.tokensFormat,
			output: prefix,
			include: cleanReq.packages.map((pkg) => `@westpac/${pkg.toLowerCase()}`),
		});
	} catch (error) {
		log.error(`The blender failed with: ${JSON.stringify(error)}`);
		response
			.status(500)
			.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
	}

	// create an archiver instance
	const archive = archiver('zip');

	archive
		.on('warning', (error) => {
			// catch warnings
			if (error.code === 'ENOENT') {
				log.error(`Could not find file or directory: ${JSON.stringify(error)}`);
				response
					.status(500)
					.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
			} else {
				log.error(`The zipping failed with: ${JSON.stringify(error)}`);
				response
					.status(500)
					.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
			}
		})
		.on('error', (error) => {
			// catch errors
			log.error(`The zipping failed with an error: ${JSON.stringify(error)}`);
			response
				.status(500)
				.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
		})
		// pipe output to our server response
		.pipe(response);

	// append each file to the zip
	if (result && result.files) {
		result.files.map(([_, { name, filePath, dir, content }]) => {
			archive.append(content, { name: `${dir.slice(prefix.length)}/${filePath}/${name}` }, 'utf-8');
		});
	}

	response.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-disposition': `attachment; filename=Blend-${cleanReq.brand}.zip`,
	});

	// finish off zip process
	archive.finalize();
}

/**
 * Sanitize request by white-listing each item
 *
 * @param  {object} request - The express request object
 * @param  {object} allPkgs - An object of all packages
 *
 * @return {object}         - A flat object with only those keys which are allowed
 */
function sanitizeRequest(request, allPkgs) {
	if (!request.body.packages || !request.body.brand || !request.body.tokensFormat) {
		return;
	}

	const pkgDict = Object.keys(allPkgs.components);
	const brandDict = Object.keys(allPkgs.brands);
	const tokensDict = ['json', 'less', 'sass', 'scss', 'css'];

	return {
		packages: request.body.packages.filter((pkg) => pkgDict.includes(pkg)),
		brand: brandDict.includes(request.body.brand) ? request.body.brand : 'wbc',
		modules: !!request.body.modules,
		prettify: !!request.body.prettify,
		includeJquery: !!request.body.includeJquery,
		versionInClass: !!request.body.versionInClass,
		tokensFormat: tokensDict.includes(request.body.tokensFormat.toLowerCase())
			? request.body.tokensFormat.toLowerCase()
			: 'json',
	};
}

/**
 * Send a message to slack
 *
 * @param  {object} options.cleanReq  - The cleaned request object
 * @param  {string} options.IP        - The IP address of this request
 * @param  {array}  options.slackUrls - An array of slack webhooks
 * @param  {string} options.time      - The time this request was made
 *
 * @return {void}
 */
function send2Slack({ cleanReq, IP, slackUrls, time }) {
	const body = {
		blocks: [
			{
				type: 'context',
				elements: [
					{
						type: 'mrkdwn',
						text: `🌐 IP: *${IP}*`,
					},
				],
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `The *Blender* has blended another \`${cleanReq.brand.toUpperCase()}\` zip!`,
				},
			},
			{
				type: 'divider',
				block_id: 'divider1',
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: '*Packages*',
				},
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: cleanReq.packages.map((pkg) => `\`${pkg}\``).join(' '),
				},
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: '*Options*',
				},
				fields: [
					{ type: 'mrkdwn', text: `Modules: \`${cleanReq.modules}\`` },
					{ type: 'mrkdwn', text: `Prettify: \`${cleanReq.prettify}\`` },
					{ type: 'mrkdwn', text: `jQuery: \`${cleanReq.includeJquery}\`` },
					{ type: 'mrkdwn', text: `Classes: \`${cleanReq.versionInClass}\`` },
					{ type: 'mrkdwn', text: `Tokens: \`${cleanReq.tokensFormat}\`` },
				],
			},
			{
				type: 'context',
				elements: [
					{
						type: 'mrkdwn',
						text: `Sent at: ${time}`,
					},
				],
			},
		],
	};

	if (process.env.SLACK_ENV === 'live') {
		slackUrls.map((slack) => {
			const options = {
				hostname: 'hooks.slack.com',
				path: slack.url,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const postRequest = https
				.request(options, (response) => {
					if (response.statusCode == 200) {
						log.info(`${slack.name} message successfully posted.`);
					} else {
						log.error(`${slack.name} message returned non 200 response: ${response.statusCode}`);
					}
				})
				.on('error', (error) => {
					log.error(`Message to ${slack.name} returned an error: ${error.message}`);
				});

			postRequest.write(JSON.stringify(body));
			postRequest.end();
		});
	}
}

/**
 * Increment our blender.log counter
 *
 * @return {void}
 */
function counter() {
	let counter = 0;

	// Create a blender.log file if one doesn't already exist
	fs.writeFile(LOGFILE, '0', { flag: 'wx' }, () => {});

	fs.readFile(LOGFILE, (error, data) => {
		if (error) {
			log.error(error);
		}

		counter = parseInt(data || 0) + 1; // add this blend

		if (!isNaN(counter)) {
			fs.writeFile(LOGFILE, String(counter), (error) => {
				if (error) {
					log.error(error);
				}
			});
		} else {
			log.error(`Counter number not valid ("${counter}"). Skipping for now.`);
		}
	});
}

/**
 * Log out info
 *
 * @type {Object}
 */
const log = {
	incoming: (text) => {
		console.info(`[INCOMING]  ${text}`);
	},

	outgoing: (text) => {
		console.info(`[OUTGOING]  ${text}`);
	},

	error: (text) => {
		console.error(`[ERROR]  ${text}`);
	},

	info: (text) => {
		console.info(`[INFO]  ${text}`);
	},
};
