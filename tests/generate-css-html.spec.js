/**
 * Testing src/generate-css-html.js functions
 *
 * generateJSFile
 **/
const path = require('path');

const { generateCss, generateHtml, convertClasses } = require('../src/generate-css-html.js');

const { babelRegister } = require('../src/packages.js');

const { SETTINGS } = require('../src/settings.js');

/**
 * generateCss
 */
describe('generateCss', () => {
	// TODO: Babel issues
	// test.only('Generate CSS', async () => {
	// 	SETTINGS.set = {
	// 		cwd: process.cwd(),
	// 	};
	//
	// 	const packagePath = path.normalize(`${__dirname}/mock/mock-project1/node_modules/@westpac/core`);
	//
	// 	babelRegister([packagePath]);
	//
	// 	const result = await generateCss({
	// 		pkg: {
	// 			name: '@westpac/core',
	// 			version: '3.17.0',
	// 			path: packagePath,
	// 			pkg: {
	// 				recipe: 'blender/recipe.js',
	// 				js: 'blender/jquery.js',
	// 				isCore: true
	// 			}
	// 		},
	// 		coreCss: '',
	// 		children: 'CORE'
	// 	});
	//
	// 	console.log(result);
	//
	// });
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
