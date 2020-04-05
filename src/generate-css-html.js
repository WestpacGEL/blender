/**
 * All functions to generate css and html
 *
 * generateCssHtml - Generate the css and html from a recipe
 * convertClasses  - Convert the parsed css classes into human readable classes
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { testLabels } = require('./tester.js');
const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Generate the css and html from a recipe
 *
 * @param  {object} options.pkg           - The package object with blender key
 * @param  {string} options.coreCSS       - The core styles to be removed
 * @param  {string} options.componentName - The name of the recipe component
 *
 * @return {object}                       - A result object with css and html keys
 */
function generateCssHtml({ pkg, coreCSS = '', componentName = 'AllStyles' }) {
	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName,
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

	parsedPkg.css = parsedPkg.css.replace(coreCSS, ''); // remove core css

	const { css, html } = convertClasses(parsedPkg, pkg.version);

	return {
		...result,
		css,
		html,
		oldCss: parsedPkg.css,
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
	let humanReadableCSS = css;
	let humanReadableHTML = html;

	ids.map((id) => {
		const oldClass = new RegExp(`css-${id}`, 'g');
		const versionString = version.replace(/\./g, '_');
		const newClass =
			'GEL' +
			(SETTINGS.get.noVersionInClass ? '-' : `-v${versionString}-`) +
			id.split('-').slice(1).join('-');

		humanReadableCSS = humanReadableCSS.replace(oldClass, newClass);
		humanReadableHTML = humanReadableHTML.replace(oldClass, newClass);
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
