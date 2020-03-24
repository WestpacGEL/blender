let { renderToStaticMarkup } = require('react-dom/server');
let h = require('react').createElement;
const BOM = require('@westpac/bom');
const { GEL } = require('@westpac/core');
const createEmotionServer = require('create-emotion-server').default;
const createCache = require('@emotion/cache').default;
const { CacheProvider } = require('@emotion/core');
let cache = createCache();
let { extractCritical } = createEmotionServer(cache);

const { Alert } = require('@westpac/alert');
const { HelpIcon } = require('@westpac/icon');

console.log(
	extractCritical(
		renderToStaticMarkup(
			h(
				CacheProvider,
				{ value: cache },
				h(
					GEL,
					{ brand: BOM },
					h(Alert, {
						look: 'info',
						children: 'Hi world',
						dismissible: true,
					}),
					h(Alert, {
						look: 'info',
						children: 'Hi world2',
					}),
					h(Alert, {
						look: 'info',
						children: 'Hi world3',
						icon: HelpIcon,
					})
				)
			)
		)
	)
);

// example

// const fs = require('fs');
// const register = require("@babel/register");
// const createElement = require('react').createElement;
// const { renderToStaticMarkup } = require('react-dom/server');
// const BOM = require('@westpac/bom');
// const createEmotionServer = require('create-emotion-server').default;
// const createCache = require('@emotion/cache').default;
// const { CacheProvider } = require('@emotion/core');
//
// const cache = createCache();
// const { extractCritical } = createEmotionServer(cache);
//
// function Example(brand) {
//
// 	const exampleComponent = require('./alert').default;
//
// 	const staticMarkup = extractCritical(
// 		renderToStaticMarkup(
// 			createElement(
// 				CacheProvider,
// 				{ value: cache },
// 				exampleComponent(BOM),
// 			)
// 		)
// 	);
//
// 	return staticMarkup;
//
// }
//
// console.log(Example(BOM));
