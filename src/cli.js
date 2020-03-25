const cfonts = require('cfonts');
const path = require('path');

const { SETTINGS, getSettings } = require('./settings.js');
const { parseComponent } = require('./parseComponent.js');
const { getComponents } = require('./getComponents.js');
const { exitHandler } = require('./exitHandler.js');
const { version } = require('../package.json');
const { CLIOPTIONS } = require('./const.js');
const { DEBUG, log } = require('./log.js');
const { color } = require('./color.js');
const { time } = require('./time.js');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	time.start();

	SETTINGS.set = getSettings();
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

module.exports = exports = {
	cli,
};
