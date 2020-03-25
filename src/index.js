const { time } = require('./time.js');

/**
 * The blender API
 */
function blender() {
	time.start();
	console.log('Hello world');
}

module.exports = exports = {
	blender,
};
