const { parseComponent } = require('./parseComponent.js');
const { DEBUG, D } = require('./debug.js');
const path = require('path');
const fs = require('fs');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	console.log('Hello world');
	DEBUG.enabled = true;

	await parseComponent({
		componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		brand: {},
	});

	console.log('bye');

	process.on('exit', ExitHandler); // on closing
	process.on('SIGINT', ExitHandler); // on [ctrl] + [c]
	process.on('uncaughtException', ExitHandler); // on uncaught exceptions
}

/**
 * Handle exiting of program
 *
 * @param {null}    exiting - null for bind
 * @param {object}  error   - Object to distinguish between closing events
 * @param {boolean} debug   - Global debug mode on/off switch
 */
function ExitHandler(exiting, error, debug = DEBUG) {
	if ((error && error !== 1) || debug.errors > 0) {
		const messages = debug.messages.join('\n');
		const logPath = path.normalize(`${process.cwd()}/blender-error.log`);
		try {
			fs.writeFileSync(logPath, messages, { encoding: 'utf8' });
		} catch (error) {
			console.error(`Unable to write error log file to "${logPath}"`);
			console.error(error);
		}
	}

	process.exit(0);
}

module.exports = exports = {
	cli,
	ExitHandler,
};
