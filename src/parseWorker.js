/**
 * All functions for parsing packages with emotion
 *
 * parseWorker    - Parsing a component to get out css and html
 * extractMarkup  - Extract the markup from a component
 **/
const createEmotionServer = require('create-emotion-server').default;
const { parentPort, workerData } = require('worker_threads');

const { setBrand } = require('./brand.js');
const { color } = require('./color.js');
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
 * @param  {string}      options.children      - The children to be passed into the component
 *
 * @return {returnObject}                      - The result of the parsing
 */
function parseWorker() {
	D.header('parseWorker', workerData);

	const { componentPath, componentName, children, SETTINGS, PACKAGES } = workerData;

	// we need to flag all packages with babel to include them
	require('@babel/register')({
		presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
		plugins: [
			require.resolve('@babel/plugin-transform-runtime'),
			[
				require.resolve('@babel/plugin-syntax-dynamic-import'),
				{
					root: SETTINGS.cwd,
					suppressResolveWarning: true,
				},
			],
		],
		only: PACKAGES.filter((pkg) => pkg.pkg.recipe).map((pkg) => `${pkg.path}`),
	});

	const brand = setBrand(SETTINGS.brand, SETTINGS.cwd, SETTINGS.scope);

	if (componentName === 'docs') {
		D.log('Running parseWorker in "docs" mode');

		let recipes;
		const result = {
			code: 0,
			error: [],
			message: [],
		};

		try {
			recipes = require(componentPath)['Docs']({ brand: brand.pkg });
		} catch (error) {
			D.error(`Component failed to be required at "${color.yellow(componentPath)}"`);
			D.error(error.toString());

			return parentPort.postMessage({
				code: 1,
				error: error.toString(),
				message: `An error occured when trying to open ${color.yellow(componentPath)}`,
			});
		}

		const allRecipes = recipes.map((variation) => {
			return extractMarkup({
				Component: variation.component,
				componentPath,
				brand: brand.pkg,
				children,
				SETTINGS,
			})
				.catch((error) => {
					D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
					D.error(error.error.toString());

					result.code = 1;
					result.error.push(error.error.toString());
					result.message.push(error.message);
				})
				.then((staticMarkup) => {
					return {
						heading: variation.heading,
						static: staticMarkup,
					};
				});
		});

		Promise.all(allRecipes).then((recipes) => {
			return parentPort.postMessage({ ...result, recipes });
		});
	} else {
		D.log('Running parseWorker in "normal" mode');

		let Component;

		try {
			Component = require(componentPath)[componentName];
		} catch (error) {
			D.error(`Component failed to be required at "${color.yellow(componentPath)}"`);
			D.error(error.toString());

			return parentPort.postMessage({
				code: 1,
				error: error.toString(),
				message: `An error occured when trying to open ${color.yellow(componentPath)}`,
			});
		}
		D.log(`Component successfully required via "${color.yellow(componentPath)}"`);

		extractMarkup({ Component, componentPath, brand: brand.pkg, children, SETTINGS })
			.catch((error) => {
				D.error(`Component failed to be rendered at "${color.yellow(componentPath)}"`);
				D.error(error.error.toString());

				return parentPort.postMessage({
					code: error.code,
					error: error.error.toString(),
					message: error.message,
				});
			})
			.then((staticMarkup) => {
				D.log(`Component successfully rendered via "${color.yellow(componentPath)}"`);

				return parentPort.postMessage({
					code: 0,
					...staticMarkup,
				});
			});
	}
}

parseWorker();

/**
 * Extract the markup from a component
 *
 * @param  {function} options.Component     - The component to be parsed
 * @param  {string}   options.componentPath - The path to this component for error message
 * @param  {object}   options.brand         - The brand to be passed into the Core
 * @param  {string}   options.children      - Possible children to be passed to the component
 *
 * @return {object}                         - The static markup in an object
 */
function extractMarkup({ Component, componentPath, brand, children, SETTINGS }) {
	D.header('extractMarkup', { Component, componentPath, brand, children, SETTINGS });

	return new Promise((resolve) => {
		// we will try to use the emotion package of the cwd before we fallback to our own
		let createCache;
		let CacheProvider;
		try {
			const emotionCorePath = require.resolve(`${SETTINGS.cwd}/node_modules/@emotion/core`);
			CacheProvider = require(emotionCorePath).CacheProvider;

			const emotionCachePath = require.resolve(`${SETTINGS.cwd}/node_modules/@emotion/cache`);
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

		const cache = createCache();
		const { extractCritical } = createEmotionServer(cache);
		let staticMarkup;

		// we will try to use the react package of the cwd before we fallback to our own
		let renderToStaticMarkup;
		let createElement;
		try {
			const reactPath = require.resolve(`${SETTINGS.cwd}/node_modules/react`);
			createElement = require(reactPath).createElement;
			const reactDomPath = require.resolve(`${SETTINGS.cwd}/node_modules/react-dom/server`);
			renderToStaticMarkup = require(reactDomPath).renderToStaticMarkup;
			D.log(
				`Used cwd react and reac-dom package at ${color.yellow(reactPath)} and ${color.yellow(
					reactDomPath
				)}`
			);
		} catch (_) {
			createElement = require('react').createElement;
			renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
			D.log(`Used local react and reac-dom package`);
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
				resolve({
					code: 1,
					error: error.toString(),
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
	parseWorker,
	extractMarkup,
};
