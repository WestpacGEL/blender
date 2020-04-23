/**
 * Testing src/generate-docs.js functions
 *
 * generateDocsFile
 * generateIndexFile
 * generateDocsAssets
 **/
const path = require('path');

const {
	generateDocsFile,
	generateIndexFile,
	generateDocsAssets,
} = require('../src/generate-docs.js');
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
				html: '<div class="GEL-core-v3_17_0">Here comes the content</div>',
			},
			{
				heading: 'Variation 2 for Core Component',
				html: '<div class="GEL-core-v3_17_0">Here comes the content</div>',
			},
		];

		const result = generateDocsFile(pkg.name, recipes);

		expect(result.includes('<h1>@westpac/core</h1>')).toBe(true);
		expect(result.includes('<h2 class="docs-h2">Variation 1 for Core Component</h2>')).toBe(true);
		expect(result.includes('<h2 class="docs-h2">Variation 2 for Core Component</h2>')).toBe(true);
	});
});

/**
 * generateIndexFile
 */
describe('generateIndexFile', () => {
	test('Get a index file to navigate the docs with WBC branding', () => {
		SETTINGS.set = {
			brand: '@westpac/WBC',
		};

		const docs = [
			{ name: '@westpac/core', path: 'packages/core.html' },
			{ name: '@westpac/component1', path: 'packages/component1.html' },
			{ name: '@westpac/component2', path: 'packages/component2.html' },
		];

		const result = generateIndexFile(docs);

		expect(result.includes('Your Westpac Design System blend')).toBe(true);
		expect(result.match(/<li class="docs-li"><a class="docs-link"/g).length).toBe(3);
	});

	test('Get a index file to navigate the docs with BOM branding', () => {
		SETTINGS.set = {
			brand: 'BOM',
		};

		const docs = [
			{ name: '@westpac/core', path: 'packages/core.html' },
			{ name: '@westpac/component1', path: 'packages/component1.html' },
		];

		const result = generateIndexFile(docs);

		expect(result.includes('Your Bank of Melbourne Design System blend')).toBe(true);
		expect(result.match(/<li class="docs-li"><a class="docs-link"/g).length).toBe(2);
	});

	test('Get a index file to navigate the docs with an invalid branding', () => {
		SETTINGS.set = {
			brand: 'VOID',
		};

		const docs = [
			{ name: '@westpac/core', path: 'packages/core.html' },
			{ name: '@westpac/component1', path: 'packages/component1.html' },
		];

		const result = generateIndexFile(docs);

		expect(result.includes('Your VOID Design System blend')).toBe(true);
		expect(result.match(/<li class="docs-li"><a class="docs-link"/g).length).toBe(2);
	});
});

/**
 * generateDocsAssets
 */
describe('generateDocsAssets', () => {
	test('Get assets files for the documentation', () => {
		const results = generateDocsAssets();

		expect(results[0].name === 'docs.min.css').toBe(true);
		expect(results[1].name === 'docs.min.js').toBe(true);
	});
});
