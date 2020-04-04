/**
 * All functions to generate css and html
 *
 * generateCssHtml - TODO
 * convertClasses  - Convert the parsed css classes into human readable classes
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { testLabels } = require('./tester.js');
const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

function generateCssHtml(pkg) {
	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName: 'AllStyles',
	});

	const testResults = testLabels(parsedPkg);
	if (testResults.code > 0) {
		result.code = testResults.code;
		result.errors.push({
			package: pkg.name,
			error: testResults.ids,
		});
		result.messages.push(
			`The package ${color.yellow(
				pkg.name
			)} could not be blended. Run the blender in test mode to find out more:\n   ${color.cyan(
				'blender -T'
			)}`
		);
	}

	const { css, html } = convertClasses(parsedPkg, pkg.version);
	console.log({ css });

	return {
		...result,
		css,
		html,
	};
}

/**
 * Convert the parsed css classes into human readable classes
 *
 * @param  {string} options.css  - The parsed CSS
 * @param  {string} options.html - The parsed html
 * @param  {array}  options.ids  - An array of ids used in the classes
 * @param  {string} version      - The version of this package
 *
 * @return {object}              - An object with the same html and css but with human readable classes
 */
function convertClasses({ css, html, ids }, version) {
	let humanReadableCSS;
	let humanReadableHTML;

	ids.map((id) => {
		const oldClass = new RegExp(`css-${id}`, 'g');
		const versionString = version.replace(/\./g, '_');
		const newClass =
			'GEL' +
			(SETTINGS.get.noVersionInClass ? '-' : `-v${versionString}-`) +
			id.split('-').slice(1).join('-');

		humanReadableCSS = css.replace(oldClass, newClass);
		humanReadableHTML = html.replace(oldClass, newClass);
	});

	return {
		css: humanReadableCSS,
		html: humanReadableHTML,
		ids,
	};
}

module.exports = exports = {
	generateCssHtml,
	convertClasses,
};
