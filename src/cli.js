/**
 * All functions we need for the cli
 *
 * cli         - The CLI function
 * help        - Display the cli help
 * exitHandler - Handle exiting of program
 **/
const cfonts = require('cfonts');
const path = require('path');
const fs = require('fs');

const { SETTINGS, getCliArgs, checkCliInput, getSettings } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { parseComponent } = require('./parseCss.js');
const { stripColor, color } = require('./color.js');
const { version } = require('../package.json');
const { CLIOPTIONS } = require('./const.js');
const { DEBUG, log } = require('./log.js');
const { time } = require('./time.js');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	time.start();

	const cliArgs = getCliArgs();
	const isGoodHuman = checkCliInput(cliArgs);

	if (isGoodHuman.pass === false) {
		isGoodHuman.errors.map((error) => {
			log.error(error);
		});
		exitHandler(1);
	}

	SETTINGS.set = getSettings(cliArgs);
	DEBUG.enabled = SETTINGS.get.debug;

	if (SETTINGS.get.version) {
		console.log(`v${version}`);
		process.exit();
	}

	if (SETTINGS.get.help) {
		help();
		process.exit();
	}

	log.start(`Blender v${version} starting`);
	PACKAGES.set = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

	// // just showing that we can run the parser, will go elsewhere
	// const thing = await parseComponent({
	// 	componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
	// 	brand: {},
	// });

	// console.log(thing);

	['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
		process.on(eventType, exitHandler.bind(null, eventType));
	});
}

/**
 * Display the cli help
 *
 * @param  {object} options - Our cli options
 *
 * @return {void}
 */
function help(options = CLIOPTIONS) {
	console.log();
	cfonts.say('blender', {
		gradient: ['red', 'cyan'],
		font: 'tiny',
		space: false,
	});
	console.log(` v${version}\n\n`);

	Object.entries(CLIOPTIONS).map(([name, option]) => {
		console.log(
			` ${color.bold(name.toUpperCase())}\n` +
				color.cyan(` --${name}, ${option.flag ? `-${option.flag}` : ''}\n`) +
				` ${option.description}\n` +
				(option.arguments
					? ` Possible arguments are: ${color.yellow(option.arguments.join(', '))}\n`
					: '') +
				` $ ${color.gray(option.example)}\n`
		);
	});
}

/**
 * Handle exiting of program
 *
 * @param {null}    exiting - null for bind
 * @param {object}  error   - Object to distinguish between closing events
 * @param {boolean} debug   - Global debug mode on/off switch
 */
function exitHandler(exiting, error, debug = DEBUG) {
	if ((error && error !== 1) || debug.errors > 0) {
		const messages =
			debug.messages.join('\n') +
			`\n\n` +
			`Errors: ${debug.errors}\n` +
			`Duration: ${time.stop()}\n`;
		const logPath = path.normalize(`${process.cwd()}/blender-error.log`);

		try {
			fs.writeFileSync(logPath, stripColor(messages), { encoding: 'utf8' });
		} catch (error) {
			console.error(`Unable to write error log file to "${logPath}"`);
			console.error(error);
		}
	}

	if (debug.enabled) {
		console.log(`\nErrors: ${debug.errors}\n`);
	}

	if (debug.errors) {
		console.log();
	} else {
		log.success(
			`Successfully blended ${color.yellow(PACKAGES.get.length)} packages in ${color.yellow(
				time.stop()
			)}\n`
		);
	}

	process.exit(exiting ? 0 : exiting);
}

module.exports = exports = {
	cli,
	help,
	exitHandler,
};
