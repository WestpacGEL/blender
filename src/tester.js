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

	LOADING.start = { total: packages.length };
	packages.map((thisPackage) => {
		D.log(`Testing ${color.yellow(thisPackage.name)}`);

		const parsedPkg = parseComponent({
			componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
			componentName: 'AllStyles',
			brand: SETTINGS.get.brand,
		});

		if (parsedPkg.status === 'error') {
			result.errors.push(parsedPkg.message);
			result.code = 1;
		}

		const ids = getValidIds(parsedPkg.ids, parsedPkg.css);
		const idResult = checkIds(ids);

		if (idResult.code === 1) {
			result.code = 1;
			result.errors.push(
				`The package ${color.yellow(
					thisPackage.name
				)} included labels that can't be made human readable: "${color.yellow(
					idResult.ids.join(', ')
				)}"`
			);
		}

		LOADING.tick();
	});
	LOADING.abort();

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

/**
 * Filter out all ids whcih have not been used in the css output
 *
 * @param  {array}  ids - An array of the ids
 * @param  {string} css - The css output to check against
 *
 * @return {array}      - Filtered ids
 */
function getValidIds(ids, css) {
	return ids.filter((id) => css.includes(`.css-${id}`));
}

/**
 * Check ids for duplication
 *
 * @param  {array} ids - An array of all ids
 *
 * @return {object}    - An object with all failing ids
 */
function checkIds(ids) {
	const result = {
		code: 0,
		ids: [],
	};

	const dict = {};
	ids.map((id) => {
		const label = id.split('-').slice(1).join('-');
		if (!dict[label]) {
			dict[label] = [];
		}

		dict[label].push(id);
	});

	Object.entries(dict).map(([_, value]) => {
		if (value.length > 1) {
			result.ids = [...result.ids, ...value];
			result.code = 1;
		}
	});

	return result;
}

module.exports = exports = {
	tester,
};
