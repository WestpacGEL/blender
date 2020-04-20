/**
 * Testing src/generate-tokens.js functions
 *
 * generateTokenFile
 **/
const path = require('path');

const { generateTokenFile } = require('../src/generate-tokens.js');
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
			name: '@westpac/wbc',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
			pkg: { tokens: true },
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
			name: '@westpac/wbc',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
			pkg: { tokens: true },
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
			name: '@westpac/wbc',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
			pkg: { tokens: true },
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
			name: '@westpac/wbc',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
			pkg: { tokens: true },
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
			name: '@westpac/wbc',
			version: '1.0.0',
			path: path.normalize(`${__dirname}/../tests/mock/mock-project1/node_modules/@westpac/wbc`),
			pkg: { tokens: true },
		};

		const result = generateTokenFile(pkg.path, SETTINGS.get.tokensFormat);

		expect(result.includes('root {')).toBe(true);
		expect(result.includes('--COLORS_color1: #ff0000;')).toBe(true);
		expect(result.includes('--BRAND: "WBC";')).toBe(true);
	});
});
