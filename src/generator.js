/**
 * All functions for the generator
 *
 * generator     - Generate files from our blender packages
 * flattenTokens - Flatten a nested object recursively into a single dimensional object
 * compileTokens - Compile flat tokens into supported languages
 **/
const path = require('path');

const { generateHTMLFile } = require('./generate-html.js');
const { generateCSSFile } = require('./generate-css.js');
const { generateJSFile } = require('./generate-js.js');
const { parseComponent } = require('./parseCss.js');
const { version } = require('../package.json');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { FILES } = require('./files.js');
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

	const includeTokens =
		(SETTINGS.get.output &&
			!SETTINGS.get.outputCss &&
			!SETTINGS.get.outputJs &&
			!SETTINGS.get.outputHtml &&
			!SETTINGS.get.outputTokens) ||
		SETTINGS.get.outputTokens
			? true
			: false;
	const includeCSS =
		(SETTINGS.get.output &&
			!SETTINGS.get.outputCss &&
			!SETTINGS.get.outputJs &&
			!SETTINGS.get.outputHtml &&
			!SETTINGS.get.outputTokens) ||
		SETTINGS.get.outputCss
			? true
			: false;
	const includeJS =
		(SETTINGS.get.output &&
			!SETTINGS.get.outputCss &&
			!SETTINGS.get.outputJs &&
			!SETTINGS.get.outputHtml &&
			!SETTINGS.get.outputTokens) ||
		SETTINGS.get.outputJs
			? true
			: false;
	const includeHTML =
		(SETTINGS.get.output &&
			!SETTINGS.get.outputCss &&
			!SETTINGS.get.outputJs &&
			!SETTINGS.get.outputHtml &&
			!SETTINGS.get.outputTokens) ||
		SETTINGS.get.outputHtml
			? true
			: false;

	// Building core
	packages
		.filter((pkg) => pkg.pkg.isCore) // we filter out all core packages
		.map((core) => {
			if (includeCSS && core.pkg.recipe) {
				// get core styles
			}

			if (includeJS && core.pkg.jquery && SETTINGS.get.includeJquery) {
				// get jquery
			}
		});

	LOADING.start = { total: packages.length };
	packages.map((thisPackage) => {
		D.log(`generating for ${color.yellow(thisPackage.name)}`);

		// Building tokens
		if (includeTokens && thisPackage.pkg.tokens) {
			let tokens = require(thisPackage.path).default;
			if (SETTINGS.get.tokensFormat !== 'json') {
				tokens = flattenTokens(tokens);
			}
			const compiledTokens = compileTokens(tokens, SETTINGS.get.tokensFormat);

			let filePath = SETTINGS.get.outputTokens || SETTINGS.get.output;
			if (SETTINGS.get.outputZip) {
				filePath = 'blender/';
			}
			const name = `tokens.${SETTINGS.get.tokensFormat}`;

			D.log(
				`Adding tokens to store at path ${color.yellow(filePath)} and name ${color.yellow(name)}`
			);
			FILES.add = {
				name,
				path: filePath,
				content: compiledTokens,
			};
		}

		let parsedData = {};
		if ((includeCSS && thisPackage.pkg.recipe) || (includeHTML && thisPackage.pkg.recipe)) {
			D.log(`Parsing package`);

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

			parsedData[thisPackage.name] = parsedPkg;
		}

		// Building CSS
		if (includeCSS && thisPackage.pkg.recipe) {
			D.log(`Creating css files`);

			const filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
			const { css } = parsedData[thisPackage.name];
			const cssFiles = generateCSSFile(css);
			// add cssFiles to file store

			console.log(`include css for ${thisPackage.name}`);
		}

		// Building HTML
		if (includeHTML && thisPackage.pkg.recipe) {
			D.log(`Creating html files`);

			const filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
			const { html } = parsedData[thisPackage.name];
			const htmlFiles = generateHTMLFile(html);
			// add htmlFiles to file store

			console.log(`include html for ${thisPackage.name}`);
		}

		// Building JS
		if (includeJS && thisPackage.pkg.jquery) {
			D.log(`Creating js files`);

			const filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
			const jsFiles = generateJSFile(thisPackage);
			// add jsFiles to file store

			console.log(`include js for ${thisPackage.name}`);
		}

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

	const langMap = {
		less: '@',
		scss: '$',
		sass: '$',
		css: '--',
	};

	const comment = [
		`/**********************************************************`,
		`             █▄▄ █   █▀▀ █▄ █ █▀▄ █▀▀ █▀█`,
		`             █▄█ █▄▄ ██▄ █ ▀█ █▄▀ ██▄ █▀▄`,
		`   == THIS FILE WAS GENERATED BY THE BLENDER v${version} ==`,
		`You can exclude this file from your version control system`,
		`**********************************************************/`,
	];

	if (lang === 'json') {
		const tokensWithComment = { ...{ _: comment }, ...tokens };
		result += JSON.stringify(tokensWithComment, null, '\t');
	} else {
		Object.entries(tokens).map(([name, value]) => {
			if (name === 'BRAND') {
				result += `${langMap[lang]}${name}: "${value}";\n`;
			} else {
				result += `${langMap[lang]}${name}: ${value};\n`;
			}
		});

		if (lang === 'css') {
			result = `root {\n${result}}`;
		}

		result = `${comment.join('\n')}\n\n${result}`;
	}

	return result;
}

module.exports = exports = {
	generator,
	flattenTokens,
	compileTokens,
};
