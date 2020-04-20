/**
 * All functions to generate the tokens file
 *
 * generateTokenFile - Generate the tokens file
 * flattenTokens     - Flatten a nested object recursively into a single dimensional object
 * compileTokens     - Compile flat tokens into supported languages
 **/
const { COMMENT } = require('./config.js');
const { D } = require('./log.js');

/**
 * Generate the tokens file
 *
 * @param  {string} pathToTokens - The path to the tokens package
 * @param  {string} tokensFormat - The tokens format
 *
 * @return {string}              - The tokens in the format specified
 */
function generateTokenFile(pathToTokens, tokensFormat) {
	D.header('generateTokenFile', { pathToTokens });

	let tokens = require(pathToTokens).default;
	if (tokensFormat !== 'json') {
		tokens = flattenTokens(tokens);
	}

	return compileTokens(tokens, tokensFormat);
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

	if (lang === 'json') {
		const tokensWithComment = { ...{ _: COMMENT }, ...tokens };
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

		result = `${COMMENT.join('\n')}\n\n${result}`;
	}

	return result;
}

module.exports = exports = {
	generateTokenFile,
	flattenTokens,
	compileTokens,
};
