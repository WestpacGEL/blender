/**
 * The entry file for the blender API
 *
 * blender - The blender API
 **/
const { SETTINGS, getSettings, checkInput } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { generator } = require('./generator.js');
const { version } = require('../package.json');
const { setBrand } = require('./brand.js');
const { tester } = require('./tester.js');
const { DEBUG } = require('./debug.js');
const { clean } = require('./clean.js');

/**
 * The blender API
 */
function blender(options = {}) {
	clean(); // clean memory

	return new Promise(async (resolve, reject) => {
		DEBUG.mode = 'api'; // setting debug mode to api means no console.logs that clutters the output

		// parse and check options
		const isGoodHuman = checkInput(options);
		SETTINGS.set = getSettings(options, options.cwd);
		DEBUG.enabled = SETTINGS.get.debug;

		if (isGoodHuman.pass === false) {
			return reject(isGoodHuman);
		}

		// return version
		if (SETTINGS.get.version) {
			return resolve(`v${version}`);
		}

		// get all packages
		PACKAGES.set = getPackages(options.cwd);

		// set brand
		const brandSetting = setBrand(SETTINGS.get.brand, SETTINGS.get.cwd);
		if (brandSetting.code > 0) {
			return reject(brandSetting);
		}

		// run tester
		if (SETTINGS.get.test) {
			const result = await tester(PACKAGES.get);
			if (result.code > 0) {
				return reject(result);
			} else {
				return resolve({
					packages: PACKAGES.get,
					options: { ...SETTINGS.get },
					result,
				});
			}
		}

		const { files, ...result } = await generator(PACKAGES.get);
		if (result.code > 0) {
			return reject(result);
		}

		return resolve({
			packages: PACKAGES.get,
			options: SETTINGS.get,
			result,
			files,
		});
	});
}

module.exports = exports = {
	blender,
};
