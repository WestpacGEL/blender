/**
 * All functions for the blender tester
 *
 * tester - TODO
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

function tester(packages) {
	D.header('tester', { packages });
	const result = {
		code: 0,
		errors: [],
	};

	// LOADING.start = { total: packages.length };
	packages.map((thisPackage) => {
		const parsedPkg = parseComponent({
			componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
			componentName: 'AllStyles',
			brand: SETTINGS.get.brand,
		});

		console.log(parsedPkg);

		// LOADING.tick();
	});
	// LOADING.abort();

	// iterate `ids`
	// checks if the `id` exists in the css output
	// checks if hash is different for same label
	// return which ones have errors (what component and what flags)

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

module.exports = exports = {
	tester,
};
