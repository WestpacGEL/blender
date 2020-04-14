/**
 * All functions for parsing packages with emotion
 *
 * parseComponent - Parsing a component to get out css and html
 * extractMarkup  - Extract the markup from a component
 **/
const createEmotionServer = require('create-emotion-server').default;
const createCache = require('@emotion/cache').default;
const { CacheProvider } = require('@emotion/core');
const { SETTINGS } = require('./settings.js');
const fs = require('fs');

const { color } = require('./color.js');
const { BRAND } = require('./brand.js');
const { D } = require('./log.js');

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
 * @param  {string}      options.componentName - The name to the component
 * @param  {brandObject} options.brand         - The brand object
 *
 * @return {returnObject}                      - The result of the parsing
 */
function parseComponent({ componentPath, componentName, brand = BRAND.get, children }) {
	D.header('parseComponent', { componentPath, componentName, brand });

	if (componentName === 'docs') {
		D.log('Running parseComponent in "docs" mode');

		let recipes;
		const result = {
			code: 0,
			error: [],
			message: [],
		};

		try {
			recipes = require(componentPath)['Docs']({ brand });
		} catch (error) {
			D.error(`Component failed to be required at "${color.yellow(componentPath)}"`);
			D.error(error);

			return {
				code: 1,
				error,
				message: `An error occured when trying to open ${color.yellow(componentPath)}`,
			};
		}

		recipes = recipes.map((variation) => {
			const staticMarkup = extractMarkup({
				Component: variation.component,
				componentPath,
				brand,
				children,
			});

			if (staticMarkup.code > 0) {
				D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
				D.error(staticMarkup.error);

				result.code = 1;
				result.error.push(staticMarkup.error);
				result.message.push(staticMarkup.message);
			}

			return {
				...variation,
				static: staticMarkup,
			};
		});

		return {
			...result,
			recipes,
		};
	} else {
		D.log('Running parseComponent in "normal" mode');

		let Component;

		try {
			Component = require(componentPath)[componentName];
		} catch (error) {
			D.error(`Component failed to be required at "${color.yellow(componentPath)}"`);
			D.error(error);

			return {
				code: 1,
				error,
				message: `An error occured when trying to open ${color.yellow(componentPath)}`,
			};
		}
		D.log(`Component successfully required via "${color.yellow(componentPath)}"`);

		const staticMarkup = extractMarkup({ Component, componentPath, brand, children });

		if (staticMarkup.code > 0) {
			D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
			D.error(staticMarkup.error);

			return {
				code: staticMarkup.code,
				error: staticMarkup.error,
				message: staticMarkup.message,
			};
		}
		D.log(`Component successfully rendered via "${color.yellow(componentPath)}"`);

		return {
			code: 0,
			...staticMarkup,
		};
	}
}

/**
 * Extract the markup from a component
 *
 * @param  {function} options.Component     - The component to be parsed
 * @param  {string}   options.componentPath - The path to this component for error message
 * @param  {object}   options.brand         - The brand to be passed into the Core
 * @param  {function} options.children      - Possible children to be passed to the component
 *
 * @return {object}                         - The static markup in an object
 */
function extractMarkup({ Component, componentPath, brand, children }) {
	D.header('extractMarkup', { Component, componentPath, brand, children });

	const cache = createCache();
	const { extractCritical } = createEmotionServer(cache);
	let staticMarkup;

	// we will try to use the react version of the cwd before we use our own
	let renderToStaticMarkup;
	let createElement;
	try {
		const reactPath = require.resolve(`${SETTINGS.get.cwd}/node_modules/react`);
		createElement = require(reactPath).createElement;
		const reactDomPath = require.resolve(`${SETTINGS.get.cwd}/node_modules/react-dom/server`);
		renderToStaticMarkup = require(reactDomPath).renderToStaticMarkup;
		D.log(
			`Used cwd react and reac-dom version at ${color.yellow(reactPath)} and ${color.yellow(
				reactDomPath
			)}`
		);
	} catch (_) {
		createElement = require('react').createElement;
		renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
		D.log(`Used local react and reac-dom version`);
	}

	try {
		staticMarkup = extractCritical(
			renderToStaticMarkup(
				createElement(
					CacheProvider,
					{ value: cache },
					Component({ brand, ...(children ? { children } : {}) })
				)
			)
		);
	} catch (error) {
		return {
			code: 1,
			error,
			message: `An error occured when trying to parse ${color.yellow(componentPath)}`,
		};
	}

	return {
		code: 0,
		...staticMarkup,
	};
}

module.exports = exports = {
	parseComponent,
	extractMarkup,
};
