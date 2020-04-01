/**
 * All functions for the generator
 *
 * generator     - Generate files from our blender packages
 * flattenTokens - Flatten a nested object recursively into a single dimensional object
 * compileTokens - Compile flat tokens into supported languages
 **/
const path = require('path');

const { parseComponent } = require('./parseCss.js');
const { version } = require('../package.json');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Generate files from our blender packages
 *
 * @param  {array} packages - An array of all packages
 *
 * @return {object}         - Results object
 */
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

		let parsedPkg;
		if (thisPackage.pkg.recipe) {
			parsedPkg = parseComponent({
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
		}

		// Building tokens
		if (thisPackage.pkg.tokens) {
			const tokens = require(thisPackage.path).default;
			if (SETTINGS.get.tokensFormat === 'json' && SETTINGS.get.outputTokens) {
				// add tokens to file store
			} else {
				const flatTokens = flattenTokens(tokens);
				const compiledTokens = compileTokens(flatTokens, SETTINGS.get.tokensFormat);
				// add compiledTokens to file store
				console.log(compiledTokens);
			}
		}

		// console.log(thisPackage);

		// generate stuff:
		// get core styles
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

/**
 * Flatten a nested object recursively into a single dimensional object
 *
 * @param  {object} tokens - The tokens in a nested object
 * @param  {string} key    - The current key
 * @param  {object} list   - The accumulated list thus far
 *
 * @return {object}        - A flat single dimensional object
 */
function flattenTokens(tokens, key = '', list = {}) {
	const seperator = key === '' ? '' : '_';

	if (typeof tokens === 'object' && !Array.isArray(tokens)) {
		Object.entries(tokens).map(([name, value]) => {
			if (typeof value === 'string') {
				list[`${key}${seperator}${name}`] = value;
			} else if (typeof value === 'number') {
				list[`${key}${seperator}${name}`] = value;
			} else if (typeof value === 'object') {
				return { ...list, ...flattenTokens(value, `${key}${seperator}${name}`, list) };
			} else {
			}
		});

		return list;
	} else if (Array.isArray(tokens)) {
		tokens.map((token, i) => {
			if (typeof token === 'string') {
				list[`${key}-${i}`] = token;
			} else {
				return { ...list, ...flattenTokens(token, `${key}${i}`, list) };
			}
		});

		return list;
	}
}

/**
 * Compile flat tokens into supported languages
 *
 * @param  {object} tokens - The flat single dimensional tokens object
 * @param  {string} lang   - The language to compile to
 *
 * @return {string}        - The tokens in the specified language
 */
function compileTokens(tokens, lang) {
	let result = '';
	result += ``;

	const prefixMap = {
		less: '@',
		scss: '$',
		sass: '$',
		css: '--',
	};

	Object.entries(tokens).map(([name, value]) => {
		if (name === 'BRAND') {
			result += `${prefixMap[lang]}${name}: "${value}";\n`;
		} else {
			result += `${prefixMap[lang]}${name}: ${value};\n`;
		}
	});

	if (lang === 'css') {
		result = `root {\n${result}}`;
	}

	result = `// THIS FILE WAS GENERATED BY THE BLENDER v${version}\n\n${result}`;

	return result;
}

module.exports = exports = {
	generator,
	flattenTokens,
	compileTokens,
};
