/**
 * All functions to clean our memory after the blender is done
 *
 * clean - The cleaning function
 **/
const { PACKAGES } = require('./packages.js');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { BRAND } = require('./brand.js');
const { FILES } = require('./files.js');
const { DEBUG } = require('./debug.js');
const { TIME } = require('./time.js');
const { D } = require('./log.js');

/**
 * The cleaning function
 */
function clean() {
	D.header('clean');

	LOADING.clean();
	PACKAGES.clean();
	SETTINGS.clean();
	BRAND.clean();
	FILES.clean();
	DEBUG.clean();
	TIME.clean();

	D.log('Finished cleaning');
}

module.exports = exports = {
	clean,
};
