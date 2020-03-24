const { renderToStaticMarkup } = require('react-dom/server');
const createEmotionServer = require('create-emotion-server').default;
const createElement = require('react').createElement;
const createCache = require('@emotion/cache').default;
const { CacheProvider } = require('@emotion/core');
const register = require('@babel/register');
const chalk = require('chalk');
const fs = require('fs');

const { D } = require('./debug.js');

/**
 * Parsing a component to get out css and html
 *
 * @typedef  {object} brandObject
 *   @property {string}   BRAND                - The brand object
 *   @property {object}   COLORS               - The colors object
 *   @property {object}   LAYOUT               - The layouts object
 *   @property {object}   OVERRIDES            - The overrides object
 *   @property {object}   PACKS                - The packs object
 *   @property {function} SPACING              - The spacing function
 *   @property {object}   TYPE                 - The type object
 *
 * @typedef  {object} returnObject
 *   @property {string}   status               - The status flag
 *   @property {object}   error                - The error object
 *   @property {string}   message              - The message in case something went wrong
 *   @property {string}   css                  - The brand object
 *   @property {string}   html                 - The colors object
 *   @property {array}    ids                  - The layouts object
 *
 * @param  {object}      options               - Arguments
 * @param  {string}      options.componentPath - The path to the component file
 * @param  {brandObject} options.brand         - The brand object
 *
 * @return {returnObject}                            -
 */
function parseComponent({ componentPath, brand }) {
	D.header('parseComponent', { componentPath, brand });

	const cache = createCache();
	const { extractCritical } = createEmotionServer(cache);
	let Component;
	let staticMarkup;

	try {
		Component = require(componentPath).default;
	} catch (error) {
		D.error(`Component failed to be required at "${chalk.yellow(componentPath)}"`);
		D.error(error);

		return {
			status: 'error',
			error,
			message: `An error occured when trying to open ${chalk.yellow(componentPath)}`,
		};
	}
	D.log(`Component successfully required via "${chalk.yellow(componentPath)}"`);

	try {
		staticMarkup = extractCritical(
			renderToStaticMarkup(createElement(CacheProvider, { value: cache }, Component({ brand })))
		);
	} catch (error) {
		D.error(`Component failed to be rendered at "${chalk.yellow(componentPath)}"`);
		D.error(error);

		return {
			status: 'error',
			error,
			message: `An error occured when trying to parse ${chalk.yellow(componentPath)}`,
		};
	}
	D.log(`Component successfully rendered via "${chalk.yellow(componentPath)}"`);

	return {
		status: 'ok',
		...staticMarkup,
	};
}

module.exports = exports = {
	parseComponent,
};
