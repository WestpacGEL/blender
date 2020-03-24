const { parseComponent } = require('../src/parseComponent.js');
const path = require('path');

describe('parseComponent', () => {
	test('parse component correctly', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			brand: {},
		});

		expect(result.status).toBe('ok');
		expect(result.ids.length).toBe(6);
		expect(result.html).not.toBe('');
		expect(result.css).not.toBe('');
	});

	test("error when component doesn't exist", () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
			brand: {},
		});

		expect(result.status).toBe('error');
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

		expect(result.status).toBe('error');
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.message.includes('parse')).toBe(true);
	});

	test('parse component correctly even without brand', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		});

		expect(result.status).toBe('ok');
		expect(result.ids.length).toBe(6);
		expect(result.html).not.toBe('');
		expect(result.css).not.toBe('');
	});
});
