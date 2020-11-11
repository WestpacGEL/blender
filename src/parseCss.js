/**
 * All functions for parsing packages with emotion
 *
 * parseComponent - Parsing a component to get out css and html
 * extractMarkup  - Extract the markup from a component
 **/
const createEmotionServer = require('create-emotion-server').default;
const { SETTINGS } = require('./settings.js');

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

	return new Promise((resolve) => {
		process.nextTick(() => {
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

					return resolve({
						code: 1,
						error,
						message: `An error occured when trying to open ${color.yellow(componentPath)}`,
					});
				}

				const allRecipes = recipes.map((variation) => {
					return extractMarkup({
						Component: variation.component,
						componentPath,
						brand,
						children,
					})
						.catch((error) => {
							D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
							D.error(error.error);

							result.code = 1;
							result.error.push(error.error);
							result.message.push(error.message);
						})
						.then((staticMarkup) => {
							return {
								...variation,
								static: staticMarkup,
							};
						});
				});

				Promise.all(allRecipes).then((recipes) => {
					return resolve({ ...result, recipes });
				});
			} else {
				D.log('Running parseComponent in "normal" mode');

				let Component;

				try {
					Component = require(componentPath)[componentName];
				} catch (error) {
					D.error(`Component failed to be required at "${color.yellow(componentPath)}"`);
					D.error(error);

					return resolve({
						code: 1,
						error,
						message: `An error occured when trying to open ${color.yellow(componentPath)}`,
					});
				}
				D.log(`Component successfully required via "${color.yellow(componentPath)}"`);

				extractMarkup({ Component, componentPath, brand, children })
					.catch((error) => {
						D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
						D.error(error.error);

						return resolve({
							code: error.code,
							error: error.error,
							message: error.message,
						});
					})
					.then((staticMarkup) => {
						D.log(`Component successfully rendered via "${color.yellow(componentPath)}"`);

						return resolve({
							code: 0,
							...staticMarkup,
						});
					});
			}
		});
	});
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

	return new Promise((resolve, reject) => {
		// we will try to use the emotion package of the cwd before we fallback to our own
		let createCache;
		let CacheProvider;
		try {
			const emotionCorePath = require.resolve(`${SETTINGS.get.cwd}/node_modules/@emotion/core`);
			CacheProvider = require(emotionCorePath).CacheProvider;

			const emotionCachePath = require.resolve(`${SETTINGS.get.cwd}/node_modules/@emotion/cache`);
			createCache = require(emotionCachePath).default;

			D.log(
				`Used cwd emotion/core and emotion/cache package at ${color.yellow(
					emotionCorePath
				)} and ${color.yellow(emotionCachePath)}`
			);
		} catch (_) {
			createCache = require('@emotion/cache').default;
			CacheProvider = require('@emotion/core').CacheProvider;
			D.log(`Used local emotion/core and emotion/cache package`);
		}

		const coreLabel = 'core';
		const seen = new WeakSet();

		const cache = createCache({
			stylisPlugins: [
				// Prepend all CSS selectors that are children of the GEL wrapper (Core) with `.GEL` parent class to increase specificity
				(context, content, selectors, parents, line, column, length, id) => {
					if (
						context !== 2 ||
						id === 107 || //@keyframes
						seen.has(selectors) ||
						seen.has(parents) ||
						!selectors.length ||
						selectors[0] === ''
					) {
						return;
					}

					seen.add(selectors);

					// Prepend selector with `.GEL `
					for (let i = 0; i < selectors.length; i++) {
						/**
						 * Don't process the following...
						 * 1. `html` or `body` selectors, possible if styles are passed to Emotion's `<Global />` component within the `<GEL>` wrapper (e.g. <GEL><Global styles={{ 'body': { margin: 0 } }} /></GEL>)
						 * 2. Core components (we don't want to increase Core's specificity)
						 * 3. Selectors already prepended with `.GEL `
						 */
						if (
							!selectors[i].includes('html') /* 1 */ &&
							!selectors[i].includes('body') /* 1 */ &&
							!selectors[i].includes(`-${coreLabel}`) /* 2 */ &&
							!selectors[i].includes('.GEL ') /* 3 */
						) {
							selectors[i] = `.GEL ${selectors[i]}`;
						}
					}
				},
			],
		});
		const { extractCritical } = createEmotionServer(cache);
		let staticMarkup;

		// we will try to use the react package of the cwd before we fallback to our own
		let renderToStaticMarkup;
		let createElement;
		try {
			const reactPath = require.resolve(`${SETTINGS.get.cwd}/node_modules/react`);
			createElement = require(reactPath).createElement;
			const reactDomPath = require.resolve(`${SETTINGS.get.cwd}/node_modules/react-dom/server`);
			renderToStaticMarkup = require(reactDomPath).renderToStaticMarkup;
			D.log(
				`Used cwd react and react-dom package at ${color.yellow(reactPath)} and ${color.yellow(
					reactDomPath
				)}`
			);
		} catch (_) {
			createElement = require('react').createElement;
			renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
			D.log(`Used local react and react-dom package`);
		}

		// we allow some garbage collection here as the next task is intense
		process.nextTick(() => {
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
				reject({
					code: 1,
					error,
					message: `An error occured when trying to parse ${color.yellow(componentPath)}`,
				});
			}

			return resolve({
				code: 0,
				...staticMarkup,
			});
		});
	});
}

module.exports = exports = {
	parseComponent,
	extractMarkup,
};
