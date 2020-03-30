/**
 * Testing src/settings.js functions
 *
 * getSettings
 * getCliArgs
 * checkInput
 * SETTINGS
 **/
const path = require('path');

const { getSettings, getCliArgs, checkInput, SETTINGS } = require('../src/settings.js');

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

		expect(result).toMatchObject({});
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

		expect(result).toMatchObject({ flag1: 'foo', flag3: false });
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

		expect(result).toMatchObject({
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

		expect(result).toMatchObject({ flag1: 'value for flag1', flag2: true, flag3: false });
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

		expect(result).toMatchObject({ flag1: 'value for flag1', flag2: true, flag3: false });
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

		expect(result).toMatchObject({
			flag1: ['flag1Value1', 'flag1Value2', 'flag1Value3'],
			flag2: true,
			flag3: true,
		});
	});

	test('Merge output settings into the output object', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
			'camel-case': {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			camelCase: 'thing',
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toMatchObject({
			camelCase: 'thing',
			flag1: 'value for flag1',
			flag2: true,
			flag3: true,
		});
	});

	test('Keep rouge flags in the settings', () => {
		const options = {
			flag1: {},
			flag2: {},
			flag3: {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			'--camel-case': 'thing',
			flag3: true,
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toMatchObject({
			'--camel-case': 'thing',
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

		expect(result).toMatchObject({});
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

		expect(result).toMatchObject({
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
			flag2: {
				flag: 'f',
			},
			flag3: {},
			'camel-case': {},
		};
		const inputArgs = [
			'path/to/node',
			'path/to/script',
			'I-belong-nowhere',
			'--flag1',
			'flag1Value1',
			'--flag3',
			'--camel-case',
			'-f',
			'value1',
			'value2',
			'value3',
		];
		const result = getCliArgs(options, inputArgs);

		expect(result).toStrictEqual({
			flag1: 'flag1Value1',
			flag3: true,
			camelCase: true,
			flag2: ['value1', 'value2', 'value3'],
		});
		expect(console.warn.mock.calls.length).toBe(1);
		expect(console.warn.mock.calls[0][0].includes('I-belong-nowhere')).toBeTruthy();
		expect(console.warn.mock.calls[0][0].includes('The cli argument')).toBeTruthy();
	});

	test('Combine short flags', () => {
		const options = {
			flag1: {
				flag: 'a',
			},
			flag2: {
				flag: 'b',
			},
			flag3: {
				flag: 'c',
			},
		};
		const inputArgs = ['path/to/node', 'path/to/script', '--flag1', 'flag1Value1', '-bc'];
		const result = getCliArgs(options, inputArgs);

		expect(result).toStrictEqual({
			flag1: 'flag1Value1',
			flag2: true,
			flag3: true,
		});
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

/**
 * SETTINGS
 */
describe('checkInput', () => {
	test('Arguments are validated correctly', () => {
		const options = {
			flag1: {
				type: 'string',
				arguments: ['dominik', 'tom'],
			},
			flag2: {
				type: 'string',
				arguments: ['dominik', 'tom'],
			},
			flag3: {
				type: 'string',
				arguments: ['dominik', 'tom'],
			},
		};

		expect(checkInput({ flag1: 'dominik' }, options).pass).toBe(true);
		expect(checkInput({ flag2: 'alex' }, options).pass).toBe(false);
		expect(checkInput({ flag3: true }, options).pass).toBe(false);
	});

	test('String type is validated correctly', () => {
		const options = {
			flag1: {
				type: 'string',
			},
			flag2: {
				type: 'string',
			},
		};

		expect(checkInput({ flag1: 'dominik' }, options).pass).toBe(true);
		expect(checkInput({ flag2: true }, options).pass).toBe(false);
	});

	test('Array type is validated correctly', () => {
		const options = {
			flag1: {
				type: 'array',
			},
			flag2: {
				type: 'array',
			},
		};

		expect(checkInput({ flag1: ['dominik', 'tom'] }, options).pass).toBe(true);
		expect(checkInput({ flag2: '' }, options).pass).toBe(false);
	});
});
