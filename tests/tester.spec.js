/**
 * Testing src/tester.js functions
 *
 * tester
 * testLabels
 * getValidIds
 * checkIds
 **/
const path = require('path');

const { tester, testLabels, getValidIds, checkIds } = require('../src/tester.js');

/**
 * tester
 */
describe('tester', () => {
	test('Test two valid packages', async () => {
		const pkgs = [
			{
				name: 'Recipe 1',
				pkg: { recipe: 'recipe1.js' },
				path: path.normalize(`${__dirname}/mock/`),
			},
			{
				name: 'Recipe 2',
				pkg: { recipe: 'recipe2.js' },
				path: path.normalize(`${__dirname}/mock/`),
			},
		];
		const result = await tester(pkgs);

		expect(result).toStrictEqual({
			code: 0,
			errors: [],
			messages: [],
		});
	});

	test('Test an invalid package', async () => {
		const pkgs = [
			{
				name: 'Invalid Recipe',
				pkg: { recipe: 'recipe-invalid.js' },
				path: path.normalize(`${__dirname}/mock/`),
			},
			{
				name: 'Invalid Labels',
				pkg: { recipe: 'recipe-invalid-test.js' },
				path: path.normalize(`${__dirname}/mock/`),
			},
		];
		const result = await tester(pkgs);

		expect(result.code).toBe(1);
		expect(result.messages[1].includes("included labels that can't be made human readable")).toBe(
			true
		);
		expect(result.errors[0].error.length).toBe(1);
		expect(result.errors[0].error[0].includes('recipe-invalid.js')).toBe(true);
		expect(result.errors[1].error[0].endsWith('-component1')).toBe(true);
		expect(result.errors[1].error[1].endsWith('-component1')).toBe(true);
		expect(result.errors[1].error[2].endsWith('-component1')).toBe(true);
	});
});

/**
 * testLabels
 */
describe('testLabels', () => {
	test('Successfully test a package while excluding ids not included in css', () => {
		const pkg = {
			ids: ['hash1-one', 'hash2-not-in-css', 'hash2-not-in-css', 'hash3-three'],
			css: 'css with .css-hash1-one and .css-hash3-three classes',
		};
		const result = testLabels(pkg);

		expect(result).toStrictEqual({ code: 0, ids: [] });
	});
});

/**
 * getValidIds
 */
describe('getValidIds', () => {
	test('Filter out all ids not included in the html', () => {
		const ids = ['one', 'two', 'three'];
		const css = 'this string contains .css-one and .css-three but not two';
		const result = getValidIds(ids, css);

		expect(result).toStrictEqual(['one', 'three']);
	});
});

/**
 * checkIds
 */
describe('checkIds', () => {
	test('Successfully test all ids as valid if no ids passed', () => {
		const result = checkIds([]);

		expect(result).toStrictEqual({ code: 0, ids: [] });
	});

	test('Successfully test all ids as valid', () => {
		const ids = ['hash1-one', 'hash2-two', 'hash3-three', 'hash4-four'];
		const result = checkIds(ids);

		expect(result).toStrictEqual({ code: 0, ids: [] });
	});

	test('Successfully test some ids as invalid', () => {
		const ids = ['hash1-one', 'hash2-two', 'hash3-two', 'hash4-three'];
		const result = checkIds(ids);

		expect(result).toStrictEqual({ code: 1, ids: ['hash2-two', 'hash3-two'] });
	});
});
