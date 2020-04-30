/**
 * All functions for parsing packages with emotion
 *
 * parseComponent - Parsing a component to get out css and html
 * extractMarkup  - Extract the markup from a component
 **/
const { PACKAGES } = require('./packages.js');
const { SETTINGS } = require('./settings.js');
const { Worker } = require('worker_threads');
const path = require('path');

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
 * @param  {string}      options.children      - The children to be passed into the component
 *
 * @return {returnObject}                      - The result of the parsing
 */
function parseComponent({ componentPath, componentName, brand = BRAND.get, children }) {
	D.header('parseComponent', { componentPath, componentName, brand, children });

	return new Promise((resolve) => {
		process.nextTick(() => {
			const worker = new Worker(path.normalize(`${__dirname}/parseWorker.js`), {
				workerData: {
					componentPath,
					componentName,
					children,
					SETTINGS: SETTINGS.get,
					PACKAGES: PACKAGES.get,
				},
			});

			worker.on('message', resolve);
			worker.on('error', resolve);
			worker.on('exit', resolve);
		});
	});
}

module.exports = exports = {
	parseComponent,
};
