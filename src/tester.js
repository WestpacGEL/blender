/**
 * All functions for the blender tester
 *
 * tester      - The tester function
 * testLabels  - Test the parsed output for unlabeled hashes
 * getValidIds - Filter out all ids which have not been used in the css output
 * checkIds    - Check ids for duplication
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * The tester function
 *
 * @param  {array}  packages - An array of all packages
 *
 * @return {object}          - An object with return code and possible errors
 */
function tester(packages) {
	D.header('tester', { packages });
	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	LOADING.start = { total: packages.length };

	return new Promise(async (resolve) => {
		const allTests = packages
			.filter((thisPackage) => thisPackage.pkg.recipe)
			.map(async (thisPackage) => {
				D.log(`Testing ${color.yellow(thisPackage.name)}`);

				// testing recipe
				let parsedPkg = await parseComponent({
					componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
					componentName: 'AllStyles',
				});

				if (parsedPkg.code > 0) {
					result.errors.push({
						package: thisPackage.name,
						error: parsedPkg.message,
					});
					result.messages.push(parsedPkg.message);
					result.code = 1;
				} else {
					const idResult = testLabels(parsedPkg);

					if (idResult.code === 1) {
						result.code = 1;
						result.errors.push({
							package: thisPackage.name,
							error: idResult.ids,
						});
						result.messages.push(
							`The package ${color.yellow(
								thisPackage.name
							)} included labels that can't be made human readable:\n    ${color.yellow(
								idResult.ids.join('\n    ')
							)}`
						);
					}
				}

				// testing docs
				parsedPkg = await parseComponent({
					componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
					componentName: 'docs',
				});

				if (parsedPkg.code > 0) {
					result.errors.push({
						package: thisPackage.name,
						error: parsedPkg.message,
					});
					result.messages.push(
						`The package ${color.yellow(
							thisPackage.name
						)} contains errors in it's documentation file:`
					);
					result.messages.push(parsedPkg.error);
					result.code = 1;
				}

				LOADING.tick();
			});

		await Promise.all(allTests);

		LOADING.abort();

		D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

		resolve(result);
	});
}

/**
 * Test the parsed output for unlabeled hashes
 *
 * @param  {object} parsedPkg - The parse output of parseComponent
 *
 * @return {object}           - An object with all failing ids
 */
function testLabels(parsedPkg) {
	const ids = getValidIds(parsedPkg.ids, parsedPkg.css);
	return checkIds(ids);
}

/**
 * Filter out all ids which have not been used in the css output
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
	testLabels,
	getValidIds,
	checkIds,
};
