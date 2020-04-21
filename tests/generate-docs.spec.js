/**
 * Testing src/generate-docs.js functions
 *
 * generateDocsFile
 * generateIndexFile
 * generateDocsAssets
 **/
const path = require('path');

const { generateDocsFile, generateIndexFile, generateDocsAssets } = require('../src/generate-docs.js');
const { SETTINGS } = require('../src/settings.js');

/**
 * generateDocsFile
 */
describe('generateDocsFile', () => {
	test('Get a docs file for an individual component', () => {

	const pkg = {
		name: '@westpac/core',
	};
	const recipes = [
		{
			heading: 'Variation 1 for Core Component',
			html: '<div class="GEL-core-v3_17_0">Here comes the content</div>'
		},
		{
			heading: 'Variation 2 for Core Component',
			html: '<div class="GEL-core-v3_17_0">Here comes the content</div>'
		}
	];

	const docsFile = generateDocsFile(pkg.name, recipes);

	console.log(docsFile);

	// Check that title and each recipe is rendered?

	});
});

/**
 * generateIndexFile
 */
describe('generateIndexFile', () => {
	test.only('Get a index file to navigate the docs', () => {
		SETTINGS.set = {
			brand: 'WBC',
		}

		const docs = [
			{ name: '@westpac/core', path: 'packages/core.html' },
			{ name: '@westpac/component1', path: 'packages/component1.html' },
			{ name: '@westpac/component2', path: 'packages/component2.html' },
		];

		const indexFile = generateIndexFile(docs);

		console.log(indexFile);

		// Check that brand is correct and each component is linked...

	});
});

/**
 * generateIndexFile
 */
describe('generateIndexFile', () => {
	test.only('Get a index file to navigate the docs', () => {

		// const brandFlag = SETTINGS.get.brand.startsWith('@westpac/')
		// 	? SETTINGS.get.brand.replace('@westpac/', '')
		// 	: SETTINGS.get.brand; <<< test this

	});
});


/**
 * generateDocsAssets
 */
describe('generateDocsAssets', () => {
	test('Get assets files for the documentation', () => {
		const docsAssets = generateDocsAssets();

		console.log(docsAssets);

		// Check that assets are rendered?

	});
});
