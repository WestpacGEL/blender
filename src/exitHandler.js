const path = require('path');
const fs = require('fs');

const { stripColor, color } = require('./color.js');
const { DEBUG, log } = require('./log.js');
const { time } = require('./time.js');

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
	exitHandler,
};
