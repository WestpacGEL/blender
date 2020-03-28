/**
 * The entry file for the blender API
 *
 * blender - The blender API
 **/
const path = require('path');

const { SETTINGS, getSettings, checkCliInput } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { parseComponent } = require('./parseCss.js');
const { clean } = require('./clean.js');
const { DEBUG } = require('./log.js');

/**
 * The blender API
 */
function blender(options = {}) {
	return new Promise(async (resolve, reject) => {
		const { cwd = process.cwd() } = options;
		DEBUG.mode = 'api';
		const isGoodHuman = checkCliInput(options);

		if (isGoodHuman.pass === false) {
			reject(isGoodHuman);
		}

		SETTINGS.set = getSettings(options, cwd);
		DEBUG.enabled = SETTINGS.get.debug;
		PACKAGES.set = getPackages(cwd);

		// const thing = await parseComponent({
		// 	componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		// 	brand: {},
		// });
		// console.log(thing);

		clean();

		resolve({
			packages: PACKAGES.get,
		});
	});
}

blender({ cwd: path.normalize(`${__dirname}/../tests/mock/mock-project1/`) }).then((data) =>
	console.log(JSON.stringify(data, null, 2))
);

module.exports = exports = {
	blender,
};
