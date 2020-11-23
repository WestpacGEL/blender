/**
 * All functions to generate css and html
 *
 * generateCss    - Generate the css from a recipe
 * generateHtml   - Generate the html from a recipe
 * convertClasses - Convert the parsed css classes into human readable classes
 **/
const path = require('path');

const { generateDocsFile } = require('./generate-docs.js');
const { convertVersion } = require('./generate-js.js');
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
 * @param  {string} options.coreCss  - The core styles to be removed
 * @param  {string} options.children - Possible children to be rendered
 *
 * @return {object}                  - A result object with css key
 */
async function generateCss({ pkg, coreCss = '', children }) {
	D.header('generateCss', { pkg, coreCss, children });

	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = await parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName: 'AllStyles',
		children,
	});

	if (parsedPkg.code > 0) {
		result.messages.push(parsedPkg.message);
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
	parsedPkg.css = parsedPkg.css.replace(coreCss, '');

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
 * @param  {string} options.coreHtml - The core html to be removed
 *
 * @return {object}                  - A result object with html key
 */
async function generateHtml({ pkg, coreHtml = '' }) {
	D.header('generateHtml', { pkg, coreHtml });

	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	const parsedPkg = await parseComponent({
		componentPath: path.normalize(`${pkg.path}/${pkg.pkg.recipe}`),
		componentName: 'docs',
	});

	if (parsedPkg.code > 0) {
		result.messages.push(parsedPkg.message);
		return result;
	}

	const recipes = parsedPkg.recipes.map((recipe) => {
		// remove core html
		const coreBits = coreHtml.split('CORE');
		const coreStart = new RegExp('^' + coreBits[0]);
		const coreEnd = new RegExp(coreBits[1] + '$');
		recipe.static.html = convertVersion(
			recipe.static.html.replace(coreStart, '').replace(coreEnd, ''),
			pkg.version
		);

		let { html } = convertClasses(recipe.static, pkg.version);

		// clean-up all disabled="" & checked="" attributes to be semantically correct
		html = html.replace(/=""/gi, '');

		return {
			heading: recipe.heading,
			subheading: recipe.subheading,
			body: recipe.body,
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
	let humanReadableHtml = html;

	const niceVersion = version.replace(/\./g, '_');
	const versionString = SETTINGS.get.noVersionInClass ? '' : `-v${niceVersion}`;

	ids.map((id) => {
		const oldClass = new RegExp(`css-${id}`, 'g');
		const idBits = id.split('-').slice(1);
		const newClass = getClassName(idBits, versionString);

		humanReadableCSS = humanReadableCSS.replace(oldClass, newClass);
		humanReadableHtml = humanReadableHtml.replace(oldClass, newClass);
	});

	// find any additional custom/nested classes
	const convertRegex = new RegExp(/__convert__[\w-]+/, 'g');
	const htmlClasses = findConvertClasses(humanReadableHtml, convertRegex);
	const cssClasses = findConvertClasses(humanReadableCSS, convertRegex);

	const convert = {
		html: htmlClasses,
		css: cssClasses,
	};

	Object.entries(convert).forEach(([key, classes]) => {
		classes.forEach((c) => {
			const currClass = c.replace('__convert__', '');
			const oldClass = new RegExp(c, 'g');
			const classBits = currClass.split('-');
			const newClass = getClassName(classBits, versionString);
			if (key === 'html') {
				humanReadableHtml = humanReadableHtml.replace(oldClass, newClass);
			} else if (key === 'css') {
				humanReadableCSS = humanReadableCSS.replace(oldClass, newClass);
			}
		});
	});

	return {
		css: humanReadableCSS,
		html: humanReadableHtml,
		ids,
	};
}

/**
 * Generate the formatted class name
 *
 * @param {array} 	bits 	- The class name split on '-' delimeter
 * @param {string} 	version	- The class version string
 *
 * @return {string}			- The string with the formatted class name
 */
function getClassName(bits, version) {
	const className =
		'GEL-' + bits[0] + version + (bits.length > 1 ? '-' : '') + bits.slice(1).join('-');

	return className;
}

/**
 * Find all classes with the __format__ prefix
 *
 * @param {string} searchString	- The string to search
 * @param {object} regex 		- The regex to use for search
 *
 * @return {array}				- An array containing all the unique classes to convert
 */
function findConvertClasses(searchString, regex) {
	const matches = Array.from(searchString.matchAll(regex), (match) => match[0]);
	const uniqueMatches = [...new Set(matches)];
	return uniqueMatches;
}

module.exports = exports = {
	generateCss,
	generateHtml,
	convertClasses,
};
