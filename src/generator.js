/**
 * All functions for the generator
 *
 * generator - TODO
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

function generator(packages) {
	D.header('generator', { packages });
	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	LOADING.start = { total: packages.length };
	packages.map((thisPackage) => {
		D.log(`generating for ${color.yellow(thisPackage.name)}`);

		const parsedPkg = parseComponent({
			componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
			componentName: 'AllStyles',
			brand: SETTINGS.get.brand,
		});

		if (parsedPkg.status === 'error') {
			result.errors.push({
				package: thisPackage.name,
				error: parsedPkg.message,
			});
			result.messages.push(parsedPkg.message);
			result.code = 1;
		}

		// generate stuff:
		// get core styles
		// build tokens
		// modules loop
		// compile module
		// get docs html
		// get recipe styles
		// ids loop
		// generate class names
		// replace prefix in css
		// build html file(s)
		// build css file(s)
		// concat js file(s)

		LOADING.tick();
	});
	LOADING.abort();

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

module.exports = exports = {
	generator,
};
