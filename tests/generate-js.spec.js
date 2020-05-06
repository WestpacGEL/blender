/**
 * Testing src/generate-js.js functions
 *
 * generateJSFile
 **/
const path = require('path');

const { generateJSFile } = require('../src/generate-js.js');

/**
 * generateJSFile
 */
describe('generateJSFile', () => {
	test('Get a js file for an individual component', () => {
		const result = generateJSFile({
			name: '@westpac/component1',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/mock/mock-project1/node_modules/@westpac/component1/`),
			pkg: {
				recipe: 'blender/recipe.js',
				js: 'blender/script.js',
			},
		});

		expect(result.code).toBe(0);
	});

	test('Attempt to get a non-existant component file', () => {
		const result = generateJSFile({
			name: '@westpac/component4',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/mock/mock-project1/node_modules/@westpac/component4/`),
			pkg: {
				recipe: 'blender/recipe.js',
				js: 'blender/script.js',
			},
		});
		expect(result.code).toBe(1);
	});
});
