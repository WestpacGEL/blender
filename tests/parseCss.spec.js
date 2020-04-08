/**
 * Testing src/parseCss.js functions
 *
 * parseComponent
 **/
const path = require('path');

const { parseComponent } = require('../src/parseCss.js');

/**
 * parseComponent
 */
describe('parseComponent', () => {
	test('parse component correctly', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.ids.length).toBe(6);
		expect(result.html).not.toBe('');
		expect(result.css).not.toBe('');
	});

	test("error when component doesn't exist", () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/void')).toBe(true);
		expect(result.message.includes('open')).toBe(true);
	});

	test('error when component is invalid', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe-invalid.js`),
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.message.includes('parse')).toBe(true);
	});

	test('parse component correctly even without brand', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		});

		expect(result.code).toBe(0);
		expect(result.ids.length).toBe(6);
		expect(result.html).not.toBe('');
		expect(result.css).not.toBe('');
	});
});
