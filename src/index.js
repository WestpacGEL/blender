const path = require('path');

const { parseComponent } = require('./parseComponent.js');
const { exitHandler } = require('./exitHandler.js');
const { DEBUG } = require('./debug.js');
const { time } = require('./time.js');

/**
 * The CLI function
 *
 * @return {void}
 */
async function cli() {
	time.start();

	console.log('Hello world');
	// DEBUG.enabled = true;

	await parseComponent({
		componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		brand: {},
	});

	console.log('bye');

	process.on('exit', exitHandler); // on closing
	process.on('SIGINT', exitHandler); // on [ctrl] + [c]
	process.on('uncaughtException', exitHandler); // on uncaught exceptions
}

module.exports = exports = {
	cli,
};
