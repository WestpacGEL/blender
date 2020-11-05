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

		const cache = createCache({
			stylisPlugins: [
				(context, content, selectors) => {
					if (
						context === -2 &&
						selectors.length &&
						selectors[0] !== '' // exclude <Global /> styles
					) {
						console.log(`Original: ${content}`);
					}
					if (
						context === -2 &&
						selectors.length &&
						selectors[0] !== '' && // exclude <Global /> styles
						!selectors[0].includes('-Core') // exclude nested <GEL /> (Core) styles
					) {
						/* 1. Strip any parsed CSS comments */
						content = content.replace(/\/\*.*?\*\//g, '');

						/**
						 * 2. Add to beginning of `content` string, if not beginning with `@`
						 * (catches `@media` and `@font-face` queries etc)
						 *
						 * Regex explanation:
						 * - ^ Beginning of string
						 * - [^@] Negated set (not `@` symbol)
						 * - .* Any character except new line, match 0 or more
						 * - /g Global search
						 */
						content = content.replace(/^[^@].*/g, (s) => `.GEL ${s}`);

						/**
						 * 3. Additionally, consider selectors found within the same string (e.g. child selectors)
						 *
						 * Regex explanation:
						 * - (;}) Capture group #1 matching `;}`
						 * - ([^@/}]) Capture group #2 matching negated set (not `@`, `/` or `}` symbol)
						 * - /g Global search
						 */
						content = content.replace(/(;})([^@/}])/g, '$1.GEL $2');

						/**
						 * 4. Additionally, insert within all @media queries
						 *
						 * Regex explanation:
						 * - @ Match `@` character
						 * - .+ Any character except new line, match 1 or more
						 * - ? Makes the preceding quantifier lazy, causing it to match as few characters as possible
						 * - /g Global search
						 *
						 * - i.e. match `@media (min-width:576px){` and `@print {`
						 */
						content = content.replace(/@.+?\{/g, (s) => `${s}.GEL `);
					}
					console.log(`Edited: ${content}`);
					return content;
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
