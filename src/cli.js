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

const { SETTINGS, getCliArgs, checkInput, getSettings } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { stripColor, color } = require('./color.js');
const { version } = require('../package.json');
const { DEBUG, D, log } = require('./log.js');
const { tester } = require('./tester.js');
const { CLIOPTIONS } = require('./const.js');
const { clean } = require('./clean.js');
const { TIME } = require('./time.js');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	TIME.start(); // start time keeping
	D.header('cli');

	// parse and check cli args
	const cliArgs = getCliArgs();
	const isGoodHuman = checkInput(cliArgs);
	SETTINGS.set = getSettings(cliArgs);
	DEBUG.enabled = SETTINGS.get.debug;

	// display version
	if (SETTINGS.get.version) {
		console.log(`v${version}`);
		process.exit();
	}

	// display help
	if (SETTINGS.get.help) {
		help();
		process.exit();
	}

	log.start(`Blender v${version}`);

	// show error messages from arg parsing
	if (isGoodHuman.pass === false) {
		isGoodHuman.errors.map((error) => {
			log.error(error);
		});
		exitHandler(1);
	}

	// show warnings from arg parsing
	if (isGoodHuman.warnings) {
		isGoodHuman.warnings.map((warning) => {
			log.warn(warning);
		});
	}

	// report on cwd
	const cwd = SETTINGS.get.cwd;
	log.info(`Running in ${color.yellow(cwd)}`);
	D.log(`Running in ${color.yellow(cwd)}`);

	// get all packages
	PACKAGES.set = getPackages(cwd);

	// run tester
	if (SETTINGS.get.test) {
		const result = tester(PACKAGES.get);
		exitHandler(result.code);
	}

	// run blender file generator

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
			`Duration: ${TIME.stop()}\n`;
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
		const packages = PACKAGES.get.length;

		if (SETTINGS.get.test) {
			if (PACKAGES.get.length === 0) {
				log.success(`No packages were found to be tested in ${color.yellow(TIME.stop())}\n`);
			} else if (exiting > 0) {
				log.error(
					`Testing ${color.yellow(PACKAGES.get.length)} packages ${color.bold('failed')} in ${color.yellow(
						TIME.stop()
					)}\n`
				);
			} else {
				log.success(
					`Testing ${color.yellow(PACKAGES.get.length)} packages ${color.bold('passed')} in ${color.yellow(
						TIME.stop()
					)}\n`
				);
			}
		} else if (packages > 0) {
			log.success(
				`Successfully blended ${color.yellow(PACKAGES.get.length)} packages in ${color.yellow(
					TIME.stop()
				)}\n`
			);
		} else {
			log.success(`No packages were found in ${color.yellow(TIME.stop())}\n`);
		}
	}

	clean();

	process.exit(exiting);
}

module.exports = exports = {
	cli,
	help,
	exitHandler,
};
