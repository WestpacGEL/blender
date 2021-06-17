/**
 * Testing src/parseCss.js functions
 *
 * parseComponent
 **/
const { createElement } = require('react');
const path = require('path');

const { parseComponent, extractMarkup } = require('../src/parseCss.js');
const { SETTINGS } = require('../src/settings.js');

/**
 * parseComponent
 */
describe('parseComponent', () => {
	test('parse AllStyles component correctly', async () => {
		const result = await parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'AllStyles',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual([
			'gshptl-component1-look1',
			'a2lehl-component1-look2',
			'1imz2ok-component1-look3',
		]);
		expect(result.html).toBe(
			'<div class="blender-gshptl-component1-look1"></div><div class="blender-a2lehl-component1-look2"></div><div class="blender-1imz2ok-component1-look3"></div>'
		);
		expect(result.css).toBe(
			'.blender-gshptl-component1-look1{background:rebeccapurple;}.blender-a2lehl-component1-look2{background:hotpinnk;}.blender-1imz2ok-component1-look3{background:red;}'
		);
	});

	test(`error when AllStyles component doesn't exist`, async () => {
		try {
			await parseComponent({
				componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
				componentName: 'AllStyles',
				brand: {},
			});
		} catch (result) {
			expect(result.code).toBe(1);
			expect(typeof result.error).not.toBe(undefined);
			expect(typeof result.message).not.toBe(undefined);
			expect(result.message.includes('tests/mock/void')).toBe(true);
			expect(result.message.includes('open')).toBe(true);
		}
	});

	test('error when AllStyles component is invalid', async () => {
		try {
			await parseComponent({
				componentPath: path.normalize(`${__dirname}/../tests/mock/recipe-invalid.js`),
				componentName: 'AllStyles',
				brand: {},
			});
		} catch (result) {
			expect(result.code).toBe(1);
			expect(typeof result.error).not.toBe(undefined);
			expect(typeof result.message).not.toBe(undefined);
			expect(result.message.includes('tests/mock/recipe-invalid.js')).toBe(true);
			expect(result.message.includes('parse')).toBe(true);
		}
	});

	test('parse AllStyles component correctly even without brand', async () => {
		const result = await parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'AllStyles',
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual([
			'gshptl-component1-look1',
			'a2lehl-component1-look2',
			'1imz2ok-component1-look3',
		]);
		expect(result.html).toBe(
			'<div class="blender-gshptl-component1-look1"></div><div class="blender-a2lehl-component1-look2"></div><div class="blender-1imz2ok-component1-look3"></div>'
		);
		expect(result.css).toBe(
			'.blender-gshptl-component1-look1{background:rebeccapurple;}.blender-a2lehl-component1-look2{background:hotpinnk;}.blender-1imz2ok-component1-look3{background:red;}'
		);
	});

	test('parse docs component correctly', async () => {
		const result = await parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'docs',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.error.length).toBe(0);
		expect(result.message.length).toBe(0);
		expect(result.recipes.length).toBe(3);
		expect(result.recipes[0].heading).toBe('Variation 1 for Component 1');
		expect(typeof result.recipes[0].component).toBe('function');
		expect(result.recipes[0].static).toStrictEqual({
			code: 0,
			html: '<div class="blender-gshptl-component1-look1">Here comes the content</div>',
			ids: ['gshptl-component1-look1'],
			css: '.blender-gshptl-component1-look1{background:rebeccapurple;}',
		});
		expect(result.recipes[1].heading).toBe('Variation 2 for Component 1');
		expect(typeof result.recipes[1].component).toBe('function');
		expect(result.recipes[1].static).toStrictEqual({
			code: 0,
			html: '<div class="blender-a2lehl-component1-look2">Here comes the content</div>',
			ids: ['a2lehl-component1-look2'],
			css: '.blender-a2lehl-component1-look2{background:hotpinnk;}',
		});
		expect(result.recipes[2].heading).toBe('Variation 3 for Component 1');
		expect(typeof result.recipes[2].component).toBe('function');
		expect(result.recipes[2].static).toStrictEqual({
			code: 0,
			html: '<div class="blender-1imz2ok-component1-look3">Here comes the content</div>',
			ids: ['1imz2ok-component1-look3'],
			css: '.blender-1imz2ok-component1-look3{background:red;}',
		});
	});

	test(`error when docs component doesn't exist`, async () => {
		try {
			await parseComponent({
				componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
				componentName: 'docs',
				brand: {},
			});
		} catch (result) {
			expect(result.code).toBe(1);
			expect(typeof result.error).not.toBe(undefined);
			expect(typeof result.message).not.toBe(undefined);
			expect(result.message.includes('tests/mock/void')).toBe(true);
			expect(result.message.includes('open')).toBe(true);
		}
	});

	test('error when docs component is invalid', async () => {
		try {
			await parseComponent({
				componentPath: path.normalize(`${__dirname}/../tests/mock/recipe-invalid.js`),
				componentName: 'docs',
				brand: {},
			});
		} catch (result) {
			expect(result.code).toBe(1);
			expect(typeof result.error).not.toBe(undefined);
			expect(typeof result.message).not.toBe(undefined);
			expect(result.message.length).toBe(3);
			expect(result.message[0].includes('tests/mock/recipe-invalid.js')).toBe(true);
			expect(result.message[1].includes('tests/mock/recipe-invalid.js')).toBe(true);
			expect(result.message[2].includes('tests/mock/recipe-invalid.js')).toBe(true);
			expect(result.recipes.length).toBe(3);
		}
	});

	test('parse AllStyles component correctly with children', async () => {
		const result = await parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe2.js`),
			componentName: 'AllStyles',
			brand: {},
			children: 'CHILD',
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual(['a8hlze-Component']);
		expect(result.html).toBe('<div class="blender-a8hlze-Component">CHILD</div>');
		expect(result.css).toBe('.blender-a8hlze-Component{background:red;}');
	});
});

/**
 * extractMarkup
 */
describe('extractMarkup', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('extract markup from a simple component', async () => {
		const result = await extractMarkup({
			Component: () => createElement('div', null, `Hello there`),
			componentPath: 'path/to/component',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.html).toBe('<div>Hello there</div>');
		expect(result.ids).toStrictEqual([]);
		expect(result.css).toBe('');
	});

	test('extract markup from a simple component with children', async () => {
		const result = await extractMarkup({
			Component: ({ children }) => createElement('div', null, `Hello ${children}`),
			componentPath: 'path/to/component',
			brand: {},
			children: 'World',
		});

		expect(result.code).toBe(0);
		expect(result.html).toBe('<div>Hello World</div>');
		expect(result.ids).toStrictEqual([]);
		expect(result.css).toBe('');
	});

	test('use local node modules over built in ones', async () => {
		SETTINGS.set = {
			cwd: path.normalize(`${__dirname}/../`),
		};

		const result = await extractMarkup({
			Component: () => createElement('div', null, 'Hello World'),
			componentPath: 'path/to/component',
			brand: {},
			children: 'World',
		});

		expect(result.code).toBe(0);
		expect(result.html).toBe('<div>Hello World</div>');
		expect(result.ids).toStrictEqual([]);
		expect(result.css).toBe('');
	});
});
