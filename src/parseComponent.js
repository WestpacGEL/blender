// const { renderToStaticMarkup } = require('react-dom/server');
// const createEmotionServer = require('create-emotion-server').default;
// const createElement = require('react').createElement;
// const createCache = require('@emotion/cache').default;
// const { CacheProvider } = require('@emotion/core');
// const register = require('@babel/register');
// const BOM = require('@westpac/bom');
// const path = require('path');
// const fs = require('fs');
//
// /**
//  * Parsing a component to get out css and html
//  *
//  * @typedef  {object} brandObject
//  *   @property {string}   BRAND                - The brand object
//  *   @property {object}   COLORS               - The colors object
//  *   @property {object}   LAYOUT               - The layouts object
//  *   @property {object}   OVERRIDES            - The overrides object
//  *   @property {object}   PACKS                - The packs object
//  *   @property {function} SPACING              - The spacing function
//  *   @property {object}   TYPE                 - The type object
//  *
//  * @typedef  {object} returnObject
//  *   @property {string}   css                  - The brand object
//  *   @property {string}   html                 - The colors object
//  *   @property {array}    ids                  - The layouts object
//  *
//  * @param  {string}      options.componentPath - The path to the component file
//  * @param  {brandObject} options.brand         - The brand object
//  *
//  * @return {returnObject}                            -
//  */
// function parseComponent({ componentPath, brand }) {
// 	const cache = createCache();
// 	const { extractCritical } = createEmotionServer(cache);
//
// 	const Component = require(componentPath).default;
//
// 	const staticMarkup = extractCritical(
// 		renderToStaticMarkup(createElement(CacheProvider, { value: cache }, Component({ brand })))
// 	);
//
// 	return staticMarkup;
// }
//
// console.log(parseComponent({ componentPath: '', brand: BOM }));
