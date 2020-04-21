/**
 * Testing src/generate-tokens.js functions
 *
 * generateTokenFile
 **/
const path = require('path');

const { generateTokenFile, flattenTokens, compileTokens } = require('../src/generate-tokens.js');
const { SETTINGS } = require('../src/settings.js');

/**
 * generateTokenFile
 */
describe('generateTokenFile', () => {
	test('Generate a token file as JSON', () => {
		SETTINGS.set = {
			tokensFormat: 'json',
		};

		const pkg = {
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		let json = false;
		try {
			json = JSON.parse(result);
		} catch (e) {}

		expect(json).not.toBe(false);
	});

	test('Generate a token file as LESS', () => {
		SETTINGS.set = {
			tokensFormat: 'less',
		};

		const pkg = {
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		expect(result.includes('@COLORS_color1: #ff0000;')).toBe(true);
		expect(result.includes('@BRAND: "WBC";')).toBe(true);
	});

	test('Generate a token file as SASS', () => {
		SETTINGS.set = {
			tokensFormat: 'sass',
		};

		const pkg = {
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		expect(result.includes('$COLORS_color1: #ff0000;')).toBe(true);
		expect(result.includes('$BRAND: "WBC";')).toBe(true);
	});

	test('Generate a token file as SCSS', () => {
		SETTINGS.set = {
			tokensFormat: 'scss',
		};

		const pkg = {
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		expect(result.includes('$COLORS_color1: #ff0000;')).toBe(true);
		expect(result.includes('$BRAND: "WBC";')).toBe(true);
	});

	test('Generate a token file as CSS', () => {
		SETTINGS.set = {
			tokensFormat: 'css',
		};

		const pkg = {
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		expect(result.includes('root {')).toBe(true);
		expect(result.includes('--COLORS_color1: #ff0000;')).toBe(true);
		expect(result.includes('--BRAND: "WBC";')).toBe(true);
	});
});

/**
 * flattenTokens
 */
describe('flattenTokens', () => {
	test('Flattens tokens with objects', () => {
		const result = flattenTokens({
			colors: ['green', 'blue'],
			height: 10,
			heights: [
				{
					small: '5',
					medium: '10',
					large: '15',
				},
			],
			deep1: {
				key: 'a',
				key: 'b',
				deep2: {
					key: 'a',
					key: 'b',
					deep3: {
						key: 'a',
						key: 'b',
					},
				},
			},
		});

		expect(result).toStrictEqual({
			'colors-0': 'green',
			'colors-1': 'blue',
			height: 10,
			heights0_small: '5',
			heights0_medium: '10',
			heights0_large: '15',
			deep1_key: 'b',
			deep1_deep2_key: 'b',
			deep1_deep2_deep3_key: 'b',
		});
	});

	test('Should not flatten strings', () => {
		const result = flattenTokens('orange');

		expect(result).toBe('orange');
	});
});
