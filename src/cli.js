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
const { parseComponent } = require('./parseComponent.js');
const { getComponents } = require('./getComponents.js');
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
		console.error(isGoodHuman.errors);
		process.exit(1);
	}

	SETTINGS.set = getSettings(cliArgs);
	DEBUG.enabled = SETTINGS.get.debug;

	if (SETTINGS.get.version) {
		console.log(`v${version}`);
		process.exit(0);
	}

	if (SETTINGS.get.help) {
		help();
		process.exit(0);
	}

	log.start(`Blender v${version} starting`);
	getComponents();

	// just showing that we can run the parser, will go elsewhere
	await parseComponent({
		componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		brand: {},
	});

	process.on('exit', exitHandler); // on closing
	process.on('SIGINT', exitHandler); // on [ctrl] + [c]
	process.on('uncaughtException', exitHandler); // on uncaught exceptions
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

	log.success(`Successfully blended ${'TODO'} components in ${time.stop()}\n`);

	process.exit(0);
}

module.exports = exports = {
	cli,
};
