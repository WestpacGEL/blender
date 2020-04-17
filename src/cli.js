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
const { generator } = require('./generator.js');
const { version } = require('../package.json');
const { CLIOPTIONS } = require('./config.js');
const { saveFiles } = require('./files.js');
const { setBrand } = require('./brand.js');
const { tester } = require('./tester.js');
const { DEBUG } = require('./debug.js');
const { clean } = require('./clean.js');
const { D, log } = require('./log.js');
const { TIME } = require('./time.js');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	TIME.start(); // start time keeping
	D.header('cli');

	// handle exiting the program
	['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
		process.on(eventType, exitHandler.bind(null, eventType));
	});

	// parse and check cli args
	const cliArgs = getCliArgs();
	const isGoodHuman = checkInput(cliArgs);
	SETTINGS.set = getSettings(cliArgs);
	DEBUG.enabled = SETTINGS.get.debug;

	// display version
	if (SETTINGS.get.version) {
		console.log(`v${version}`);
		process.exit('no output');
	}

	// display help
	if (SETTINGS.get.help) {
		help();
		process.exit('no output');
	}

	log.start(`Blender v${version}`);

	// show error messages from arg parsing
	if (isGoodHuman.pass === false) {
		isGoodHuman.errors.map((error) => {
			log.error(error);
		});
		process.exit(1);
	}

	// show warnings from arg parsing
	if (isGoodHuman.warnings) {
		isGoodHuman.warnings.map((warning) => {
			log.warn(warning);
		});
	}

	if (
		!SETTINGS.get.outputCss &&
		!SETTINGS.get.outputJs &&
		!SETTINGS.get.outputDocs &&
		!SETTINGS.get.outputTokens &&
		!SETTINGS.get.test
	) {
		log.error(`You need to specify an output path`);
		log.info(
			`You can specify an output path for all assets with ${color.cyan(
				'-o path/'
			)}.\n   To learn more have a look into our help ${color.cyan('$ blender -h')}.`
		);
		process.exit(1);
	}

	const cwd = SETTINGS.get.cwd;

	// get brand
	const brandSetting = setBrand(SETTINGS.get.brand, cwd);
	if (brandSetting.code > 0) {
		brandSetting.messages.map((error) => {
			log.error(error);
		});
		log.info(
			`You can specify a brand with the ${color.yellow('--brand')}\n   ` +
				`Example: ${color.cyan('$ blender --brand WBC')} or ${color.cyan(
					'$ blender --brand "@westpac/stg"'
				)}`
		);
		process.exit(1);
	}

	// report on cwd
	log.info(`Running in ${color.bold(cwd)}`);
	D.log(`Running in ${color.yellow(cwd)}`);

	// get all packages
	PACKAGES.set = getPackages(cwd);

	// run tester
	if (SETTINGS.get.test) {
		const result = await tester(PACKAGES.get);
		if (result.messages) {
			result.messages.map((error) => {
				log.error(error);
			});
		}

		process.exit(result.code);
	}

	const result = await generator(PACKAGES.get);
	if (result.code > 0) {
		result.messages.map((error) => {
			log.error(error);
		});
	}
	if (result.code === 0 && result.messages.length) {
		result.messages.map((warnings) => {
			log.warn(warnings);
		});
	}

	try {
		await saveFiles();
	} catch (error) {
		log.error(error);
	}
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
 * @param {null}           _       - null for bind
 * @param {string|number}  error   - The return code
 * @param {boolean}        debug   - Global debug mode on/off switch
 */
function exitHandler(_, error, debug = DEBUG) {
	if (!TIME.hasStopped()) {
		const time = TIME.stop();

		if (error === 'no output') {
			clean();
			process.exit(error);
		} else {
			if ((error && error !== 0) || debug.errorCount > 0) {
				const messages = debug.messages
					? debug.messages.join('\n') +
					  `\n\n` +
					  `Errors: ${debug.errorCount}\n` +
					  `Duration: ${time}\n`
					: [];
				const logPath = path.normalize(`${process.cwd()}/blender-error.log`);

				try {
					fs.writeFileSync(logPath, stripColor(messages), { encoding: 'utf8' });
				} catch (error) {
					console.error(`Unable to write error log file to "${logPath}"`);
					console.error(error);
				}
			}

			if (debug.enabled) {
				console.log(`\nErrors: ${debug.errorCount}\n`);
			}

			if (debug.errorCount || error !== 0) {
				log.error(`Blender stopped after ${color.yellow(time)}\n`);
			} else {
				const packages = PACKAGES.get.length;

				if (SETTINGS.get.test) {
					if (PACKAGES.get.length === 0) {
						log.success(`No packages were found to be tested in ${color.yellow(time)}\n`);
					} else if (error > 0) {
						log.error(
							`Testing ${color.yellow(PACKAGES.get.length)} packages ${color.bold(
								'failed'
							)} in ${color.yellow(time)}\n`
						);
					} else {
						log.success(
							`Testing ${color.yellow(PACKAGES.get.length)} packages ${color.bold(
								'passed'
							)} in ${color.yellow(time)}\n`
						);
					}
				} else if (packages > 0) {
					log.success(
						`Successfully blended ${color.yellow(PACKAGES.get.length)} packages in ${color.yellow(
							time
						)}\n`
					);
				} else {
					log.success(`No packages were found in ${color.yellow(time)}\n`);
				}
			}

			clean();
			process.exit(error);
		}
	}
}

module.exports = exports = {
	cli,
	help,
	exitHandler,
};
