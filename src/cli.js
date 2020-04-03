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
const { FILES, saveFiles } = require('./files.js');
const { generator } = require('./generator.js');
const { version } = require('../package.json');
const { DEBUG, D, log } = require('./log.js');
const { CLIOPTIONS } = require('./const.js');
const { tester } = require('./tester.js');
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

	// report on cwd
	const cwd = SETTINGS.get.cwd;
	log.info(`Running in ${color.yellow(cwd)}`);
	D.log(`Running in ${color.yellow(cwd)}`);

	// get all packages
	PACKAGES.set = getPackages(cwd);

	// run tester
	if (SETTINGS.get.test) {
		const result = tester(PACKAGES.get);
		if (result.messages) {
			result.messages.map((error) => {
				log.error(error);
			});
		}

		process.exit(result.code);
	}

	const result = generator(PACKAGES.get);
	if (result.messages) {
		result.messages.map((error) => {
			log.error(error);
		});
	}

	FILES.add = {
		name: 'thing1.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing2.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing3.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing4.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing5.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing6.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing7.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing8.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing9.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing10.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing11.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing12.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing13.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing14.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing15.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing16.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing17.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing18.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing19.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing20.js',
		path: 'path/to',
		content: "alert('Hello World');",
		category: 'js',
	};
	FILES.add = {
		name: 'thing21.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing22.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing23.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing24.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing25.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing26.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing27.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing28.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing29.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing30.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing31.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing32.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing33.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing34.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing35.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing36.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing37.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing38.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing39.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing40.css',
		path: 'path/to',
		content: 'body { background red; }',
		category: 'css',
	};
	FILES.add = {
		name: 'thing41.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing42.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing43.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing44.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing45.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing46.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing47.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing48.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing49.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing50.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing51.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing52.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing53.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing54.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing55.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing56.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing57.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing58.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing59.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'thing60.html',
		path: 'path/to',
		content: '<html><title /><body>Hello World</body></html>',
		category: 'html',
	};
	FILES.add = {
		name: 'token.json',
		path: 'path/to',
		content: '{"bg": "#bada55"}',
		category: 'token',
	};
	FILES.add = {
		name: 'token.css',
		path: 'path/to',
		content: 'root{--bg:#bada55;}',
		category: 'token',
	};
	FILES.add = {
		name: 'token.less',
		path: 'path/to',
		content: '@bg: #bada55;',
		category: 'token',
	};
	FILES.add = {
		name: 'token.sass',
		path: 'path/to',
		content: '$bg: "#bada55";',
		category: 'token',
	};

	// generator...

	await saveFiles();
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
			if ((error && error !== 1) || debug.errorCount > 0) {
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

			if (debug.errorCount) {
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
