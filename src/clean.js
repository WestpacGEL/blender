/**
 * All functions to clean our memory after the blender is done
 *
 * clean - The cleaning function
 **/
const { PACKAGES } = require('./packages.js');
const { SETTINGS } = require('./settings.js');
const { DEBUG, D } = require('./log.js');
const { TIME } = require('./time.js');

/**
 * The cleaning function
 */
function clean() {
	D.header('clean');

	PACKAGES.clean();
	SETTINGS.clean();
	DEBUG.clean();
	TIME.clean();

	D.log('Finished cleaning');
}

module.exports = exports = {
	clean,
};
