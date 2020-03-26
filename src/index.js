/**
 * The entry file for the blender API
 *
 * blender - The blender API
 **/
const { checkCliInput } = require('./settings.js');
const { time } = require('./time.js');

/**
 * The blender API
 */
function blender(options) {
	const isGoodHuman = checkCliInput(options);

	if (isGoodHuman.pass === false) {
		return isGoodHuman;
	}

	console.log('Hello world');
}

module.exports = exports = {
	blender,
};
