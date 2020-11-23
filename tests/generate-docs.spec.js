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
				heading: 'Variation 1 for Core Component heading',
				subheading: 'Variation 1 for Core Component subheading',
				body: 'Variation 1 for Core Component body',
				html: '<div class="GEL-core-v3_17_0">Here comes the content</div>',
			},
			{
				heading: 'Variation 2 for Core Component heading',
				subheading: 'Variation 2 for Core Component subheading',
				body: 'Variation 2 for Core Component body',
				html: '<div class="GEL-core-v3_17_0">Here comes the content</div>',
			},
		];

		const result = generateDocsFile(pkg.name, recipes);

		expect(result.includes('<h1>@westpac/core</h1>')).toBe(true);

		expect(result).toContain(
			'<h2 id="Variation_1_for_Core_Component_heading" class="docs-h2">Variation 1 for Core Component heading</h2>'
		);
		expect(result).toContain('<h3 class="docs-h3">Variation 1 for Core Component subheading</h3>');
		expect(result).toContain('<div class="docs-body">Variation 1 for Core Component body</div>');

		expect(result).toContain(
			'<h2 id="Variation_2_for_Core_Component_heading" class="docs-h2">Variation 2 for Core Component heading</h2>'
		);
		expect(result).toContain('<h3 class="docs-h3">Variation 2 for Core Component subheading</h3>');
		expect(result).toContain('<div class="docs-body">Variation 2 for Core Component body</div>');
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

		expect(result.includes('<p>Brand: <strong>Westpac</strong></p>')).toBe(true);
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

		expect(result.includes('<p>Brand: <strong>Bank of Melbourne</strong></p>')).toBe(true);
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

		expect(result.includes('<p>Brand: <strong>VOID</strong></p>')).toBe(true);
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
