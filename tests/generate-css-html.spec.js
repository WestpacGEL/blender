/**
 * Testing src/generate-css-html.js functions
 *
 * generateCss
 * generateHtml
 * convertClasses
 **/
const path = require('path');

const { generateCss, generateHtml, convertClasses } = require('../src/generate-css-html.js');
const { SETTINGS } = require('../src/settings.js');

/**
 * generateCss
 */
describe('generateCss', () => {
	test('Generate CSS', async () => {
		const result = await generateCss({
			pkg: {
				name: '@westpac/core',
				version: '3.17.0',
				path: path.normalize(`${__dirname}/../tests/mock/`),
				pkg: {
					recipe: 'recipe2.js',
					isCore: true,
				},
			},
			coreCss: '',
			children: 'CORE',
		});

		// console.log(result);
	});
});

/**
 * generateHtml
 */
describe('generateHtml', () => {
	test('Generate HTML', async () => {});
});

/**
 * convertClasses
 */
describe('convertClasses', () => {
	test('Convert HTML and CSS classes', () => {
		const result = convertClasses(
			{
				html: '<div class="css-zje891-component1-look1">Content</div>',
				css:
					'.css-981abc-core{background:orange;}.css-981abc-core:after{content:"Core";}.css-zje891-component1-look1{background:#ffffff;}',
				ids: ['981abc-core', 'zje891-component1-look1'],
			},
			'0.1.0'
		);

		expect(result.html).toStrictEqual('<div class="GEL-component1-v0_1_0-look1">Content</div>');
		expect(result.css).toStrictEqual(
			'.GEL-core-v0_1_0{background:orange;}.GEL-core-v0_1_0:after{content:"Core";}.GEL-component1-v0_1_0-look1{background:#ffffff;}'
		);
	});
});
