/**
 * Testing src/settings.js functions
 *
 * getSettings
 * getCliArgs
 * SETTINGS
 **/
const path = require('path');

const { getSettings, SETTINGS, getCliArgs } = require('../src/settings.js');

/**
 * getSettings
 */
describe('getSettings', () => {
	test('Get nothing when nothing is set', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
		};
		const cwd = process.cwd();
		const cliArgs = {};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({});
	});

	test('Get default settings when nothing else is set', () => {
		const options = {
			flag1: {
				default: 'foo',
			},
			flag2: {},
			flag3: {
				default: false,
			},
		};
		const cwd = process.cwd();
		const cliArgs = {
			flag1: 'foo',
			flag3: false,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({ flag1: 'foo', flag3: false });
	});

	test('Get cli settings when nothing else is set', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
			flag4: {
				flag: 'a',
			},
			flag5: {
				flag: 'b',
			},
		};
		const cwd = process.cwd();
		const cliArgs = {
			flag4: true,
			flag5: true,
			flag1: ['flag1Value1', 'flag1Value2', 'flag1Value3'],
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			flag1: ['flag1Value1', 'flag1Value2', 'flag1Value3'],
			flag3: true,
			flag4: true,
			flag5: true,
		});
	});

	test('Get package.json settings when nothing else is set', () => {
		const options = {};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({ flag1: 'value for flag1', flag2: true, flag3: false });
	});

	test('Merge package settings over defaults', () => {
		const options = {
			flag1: {
				default: 'default value',
			},
			flag2: {
				default: false,
			},
			flag3: {
				default: false,
			},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({ flag1: 'value for flag1', flag2: true, flag3: false });
	});

	test('Merge cli settings over package settings over defaults', () => {
		const options = {
			flag1: {
				default: 'default value',
			},
			flag2: {
				default: false,
			},
			flag3: {
				default: false,
			},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			flag1: ['flag1Value1', 'flag1Value2', 'flag1Value3'],
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			flag1: ['flag1Value1', 'flag1Value2', 'flag1Value3'],
			flag2: true,
			flag3: true,
		});
	});

	test('Convert to camel case options', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
			'camel-case-flag': {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			'camel-case-flag': 'flag2',
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			camelCaseFlag: 'flag2',
			flag1: 'value for flag1',
			flag2: true,
			flag3: true,
		});
	});

	test('Merge output settings into the output object', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
			output: {
				default: {},
			},
			'output-flag1': {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			'output-flag1': 'output for flag 1',
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			output: { flag1: 'output for flag 1' },
			flag1: 'value for flag1',
			flag2: true,
			flag3: true,
		});
	});

	test('Spread output setting into all output keys', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
			output: {
				default: {},
			},
			'output-flag1': {
				type: 'string',
			},
			'output-flag2': {
				type: 'string',
			},
			'output-flag3': {
				type: 'string',
			},
			'output-nope': {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			output: 'path/to/output',
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			output: { flag1: 'path/to/output', flag2: 'path/to/output', flag3: 'path/to/output' },
			flag1: 'value for flag1',
			flag2: true,
			flag3: true,
		});
	});

	test('Log when there was no package.json found', () => {
		console.info = jest.fn();

		const options = {};
		const cwd = 'null/void/';
		const cliArgs = {};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({});
		expect(console.info.mock.calls.length).toBe(1);
		expect(console.info.mock.calls[0][0].includes('found')).toBeTruthy();
		expect(console.info.mock.calls[0][0].includes('package.json')).toBeTruthy();
	});

	test('Record cli rogue agrs', () => {
		const options = {
			flag1: {},
			flag2: {
				flag: 'a',
			},
			flag3: {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			flag3: true,
			'--i-am-rogue': true,
			'-x': true,
			flag2: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toStrictEqual({
			flag1: 'value for flag1',
			flag2: true,
			flag3: true,
			'--i-am-rogue': true,
			'-x': true,
		});
	});
});

/**
 * getCliArgs
 */
describe('getCliArgs', () => {
	test('Warn when a cli argument is orphaned', () => {
		console.warn = jest.fn();

		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
		};
		const inputArgs = [
			'path/to/node',
			'path/to/script',
			'I-belong-nowhere',
			'--flag1',
			'flag1Value1',
			'--flag3',
		];
		const result = getCliArgs(options, inputArgs);

		expect(result).toStrictEqual({
			flag1: 'flag1Value1',
			flag3: true,
		});
		expect(console.warn.mock.calls.length).toBe(1);
		expect(console.warn.mock.calls[0][0].includes('I-belong-nowhere')).toBeTruthy();
		expect(console.warn.mock.calls[0][0].includes('The cli argument')).toBeTruthy();
	});
});

/**
 * SETTINGS
 */
describe('SETTINGS', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Get the current settings', () => {
		expect(SETTINGS.get).toStrictEqual({});
	});

	test('Set the settings', () => {
		const settings = {
			key: 'value',
			sub: {
				deep: 'value',
			},
		};
		SETTINGS.set = settings;

		expect(SETTINGS.get).toStrictEqual(settings);
	});
});