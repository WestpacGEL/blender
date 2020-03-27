/**
 * The entry file for the blender API
 *
 * blender - The blender API
 **/
const path = require('path');

const { SETTINGS, getSettings, checkCliInput } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { parseComponent } = require('./parseCss.js');
const { time } = require('./time.js');
const { DEBUG } = require('./log.js');

/**
 * The blender API
 */
function blender(options = {}) {
	return new Promise(async (resolve, reject) => {
		DEBUG.mode = 'api';
		const isGoodHuman = checkCliInput(options);

		if (isGoodHuman.pass === false) {
			reject(isGoodHuman);
		}

		SETTINGS.set = getSettings(options);
		DEBUG.enabled = SETTINGS.get.debug;
		PACKAGES.set = getPackages();

		const thing = await parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			brand: {},
		});
		console.log(thing);

		resolve({
			packages: PACKAGES.get,
		});
	});
}

blender();

module.exports = exports = {
	blender,
};
