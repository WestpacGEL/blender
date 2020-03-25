/**
 * Functions around ANSI colors
 *
 * stripColor - Remove ansi colors from a string
 * color      - Returning ansi escape color codes
 **/

/**
 * Remove ansi colors from a string
 *
 * @param  {string} text - The text to be stripped
 *
 * @return {string}      - Stripped text
 */
const stripColor = (text) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))',
	].join('|');
	const ansi = new RegExp(pattern, 'g');

	if (typeof text === 'string') {
		return text.replace(ansi, '');
	} else {
		return text;
	}
};

/**
 * Returning ansi escape color codes
 * Credit to: https://github.com/chalk/ansi-styles
 *
 * @type {Object}
 */
export const color = {
	/**
	 * Parse ansi code while making sure we can nest colors
	 *
	 * @param  {string} text  - The text to be enclosed with an ansi escape string
	 * @param  {string} start - The color start code, defaults to the standard color reset code 39m
	 * @param  {string} end   - The color end code
	 *
	 * @return {string}       - The escaped text
	 */
	parse: (text, start, end = `39m`) => {
		if (text !== undefined) {
			const replace = new RegExp(`\\u001b\\[${end}`, 'g'); // find any resets so we can nest styles

			return `\u001B[${start}${text.toString().replace(replace, `\u001B[${start}`)}\u001b[${end}`;
		} else {
			return ``;
		}
	},

	/**
	 * Color a string with ansi escape codes
	 *
	 * @param  {string} text - The string to be wrapped
	 *
	 * @return {string}      - The string with opening and closing ansi escape color codes
	 */
	black: (text) => color.parse(text, `30m`),
	red: (text) => color.parse(text, `31m`),
	green: (text) => color.parse(text, `32m`),
	yellow: (text) => color.parse(text, `33m`),
	blue: (text) => color.parse(text, `34m`),
	magenta: (text) => color.parse(text, `35m`),
	cyan: (text) => color.parse(text, `36m`),
	white: (text) => color.parse(text, `37m`),
	gray: (text) => color.parse(text, `90m`),
	bold: (text) => color.parse(text, `1m`, `22m`),
};

module.exports = exports = {
	color,
	stripColor,
};
