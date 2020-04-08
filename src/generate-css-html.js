/**
 * All functions to generate css and html
 *
 * generateCss    - Generate the css from a recipe
 * generateHtml   - Generate the html from a recipe
 * convertClasses - Convert the parsed css classes into human readable classes
 **/
const path = require('path');

const { generateDocsFile } = require('./generate-docs.js');
const { parseComponent } = require('./parseCss.js');
const { version } = require('../package.json');
const { testLabels } = require('./tester.js');
const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Generate the css from a recipe
 *
 * @param  {object} options.pkg      - The package object with blender key
 * @param  {string} options.coreCSS  - The core styles to be removed
 * @param  {string} options.children - Possible children to be rendered
 *
 * @return {object}                  - A result object with css key
 */
function generateCss({ pkg, coreCSS = '', children }) {
	D.header('generateCss', { pkg, coreCSS, children });

	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName: 'AllStyles',
		children,
	});

	if (parsedPkg.code > 0) {
		result.messages.push(parsedPkg.message);
		result.code = 0;

		return result;
	}

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
			)} could not be blended. Run the blender in test mode to find out more:\n   Example: ${color.cyan(
				'$ blender -T'
			)}`
		);
	}

	// remove core css
	parsedPkg.css = parsedPkg.css.replace(coreCSS, '');

	let { css } = convertClasses(parsedPkg, pkg.version);

	css = `/*! ${pkg.name} v${pkg.version} blended with blender v${version} */\n${css}`;

	return {
		...result,
		css,
		oldCss: parsedPkg.css,
		oldHtml: parsedPkg.html,
	};
}

/**
 * Generate the html from a recipe
 *
 * @param  {object} options.pkg      - The package object with blender key
 * @param  {string} options.coreHTML - The core html to be removed
 *
 * @return {object}                  - A result object with html key
 */
function generateHtml({ pkg, coreHTML = '' }) {
	D.header('generateHtml', { pkg, coreHTML });

	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName: 'docs',
	});

	if (parsedPkg.code > 0) {
		result.messages.push(parsedPkg.message);
		result.code = 0;

		return result;
	}

	const recipes = parsedPkg.recipes.map((recipe) => {
		const testResults = testLabels(recipe.static);
		if (testResults.code > 0) {
			result.code = testResults.code;
			result.errors.push({
				package: pkg.name,
				error: testResults.ids,
			});
			result.messages.push(
				`The package ${color.yellow(
					pkg.name
				)} could not be blended. Run the blender in test mode to find out more:\n   Example: ${color.cyan(
					'$ blender -T'
				)}`
			);
		}

		// remove core html
		const coreBits = coreHTML.split('CORE');
		const coreStart = new RegExp('^' + coreBits[0]);
		const coreEnd = new RegExp(coreBits[1] + '$');
		recipe.static.html = recipe.static.html.replace(coreStart, '').replace(coreEnd, '');

		let { html } = convertClasses(recipe.static, pkg.version);

		return {
			heading: recipe.heading,
			html,
		};
	});

	return {
		...result,
		html: generateDocsFile(pkg.name, recipes),
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
	D.header('convertClasses', { css, html, ids, version });

	let humanReadableCSS = css;
	let humanReadableHTML = html;

	ids.map((id) => {
		const oldClass = new RegExp(`css-${id}`, 'g');
		const versionString = version.replace(/\./g, '_');
		const newClass =
			'GEL-' +
			id.split('-').slice(1).join('-') +
			(SETTINGS.get.noVersionInClass ? '' : `-v${versionString}`);

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
	generateCss,
	generateHtml,
	convertClasses,
};
