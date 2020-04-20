/**
 * Testing src/settings.js functions
 *
 * SETTINGS
 * getSettings
 * camelCase
 * getPkgOptions
 * getCliArgs
 * checkInput
 **/
const path = require('path');

const {
	SETTINGS,
	getSettings,
	camelCase,
	getPkgOptions,
	getCliArgs,
	checkInput,
} = require('../src/settings.js');

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

	test('Clear the settings', () => {
		const settings = {
			key: 'value',
			sub: {
				deep: 'value',
			},
		};
		SETTINGS.set = settings;

		expect(SETTINGS.get).toStrictEqual(settings);

		SETTINGS.clean();

		expect(SETTINGS.get).toStrictEqual({});
	});
});

/**
 * getSettings
 */
describe('getSettings', () => {
	beforeEach(() => {
		jest.resetModules();
	});

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

	test('Record cli rogue args', () => {
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

	test('Spread output to all output settings', () => {
		const cliArgs = {
			output: 'thing',
		};

		const result = getSettings(cliArgs);

		expect(result).toMatchObject({
			output: 'thing',
			outputCss: 'thing/css/',
			outputJs: 'thing/js/',
			outputDocs: 'thing/docs/',
			outputTokens: 'thing/tokens/',
		});
	});

	test(`Don't spread output to all output settings when one is set`, () => {
		const options = {
			output: {},
			'output-css': {},
			'output-js': {},
			'output-docs': {},
			'output-tokens': {},
		};
		const cwd = path.normalize(`${__dirname}/mock/pkg1/`);
		const cliArgs = {
			output: 'thing',
			outputDocs: 'other thing',
		};

		const result = getSettings(cliArgs, cwd, options);

		expect(result).toMatchObject({
			output: 'thing',
			outputDocs: 'other thing',
		});
	});

	test('Set the cwd with cli arguments', () => {
		const cliArgs = {
			cwd: 'path/to/cwd',
		};

		const result = getSettings(cliArgs);

		expect(result.cwd.endsWith('path/to/cwd')).toBeTruthy();
	});
});

/**
 * CAMELCASE
 */
describe('camelCase', () => {
	test('Camel case a word', () => {
		expect(camelCase('camel-case-this')).toBe('camelCaseThis');
		expect(camelCase('-case-this')).toBe('CaseThis');
	});

	test('Return if not string', () => {
		expect(camelCase(2)).toBe(2);
	});
});

/**
 * GETPKGOPTIONS
 */
describe('getPkgOptions', () => {
	test('Get blender options from package.json', () => {
		expect(getPkgOptions(path.normalize(`${__dirname}/mock/`))).toMatchObject({
			cwd: 'path/to/cwd',
			test: true,
			scope: '@bank',
			output: 'path/to/all',
			outputCss: 'path/to/css',
			outputJs: 'path/to/js',
			outputHtml: 'path/to/html',
			outputToken: 'path/to/token',
			outputZip: true,
			tokensFormat: 'css',
			include: ['@westpac/button', '@westpac/core'],
			exclude: ['@westpac/tabcordion'],
			prettify: true,
			modules: true,
			brand: 'BOM',
			excludeJquery: false,
			versionInClass: false,
		});
	});

	test('Warn when no package.json was found', () => {
		console.info = jest.fn();
		getPkgOptions(path.normalize(`${__dirname}/void`));

		expect(console.info.mock.calls.length).toBe(1);
		expect(console.info.mock.calls[0][0].includes('No package.json file found')).toBeTruthy();
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

	test('Include unknown flags', () => {
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
		const inputArgs = ['path/to/node', 'path/to/script', '--flag4', '-cd'];
		const result = getCliArgs(options, inputArgs);

		expect(result).toStrictEqual({
			'--flag4': true,
			'-d': true,
			flag3: true,
		});
	});

	test('Respect the types', () => {
		const options = {
			flag1: {
				type: 'string',
			},
			flag2: {
				type: 'boolean',
			},
			flag3: {
				type: 'array',
			},
		};
		const inputArgs = [
			'path/to/node',
			'path/to/script',
			'--flag1',
			'flag1Value1',
			'--flag2',
			'--flag3',
			'value1',
		];
		const result = getCliArgs(options, inputArgs);

		expect(result).toStrictEqual({
			flag1: 'flag1Value1',
			flag2: true,
			flag3: ['value1'],
		});
	});
});

/**
 * checkInput
 */
describe('checkInput', () => {
	test('Arguments are validated correctly', () => {
		const options = {
			flag1: {
				type: 'string',
				arguments: ['dominik', 'thomas'],
			},
			flag2: {
				type: 'string',
				arguments: ['dominik', 'thomas'],
			},
			flag3: {
				type: 'string',
				arguments: ['dominik', 'thomas'],
			},
		};

		expect(checkInput({ flag1: 'dominik' }, options).pass).toBeTruthy();
		expect(checkInput({ flag2: 'alex' }, options).pass).toBeFalsy();
		expect(checkInput({ flag1: 'DOMINIK' }, options).pass).toBeFalsy();
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

		expect(checkInput({ flag1: 'dominik' }, options).pass).toBeTruthy();
		expect(checkInput({ flag2: true }, options).pass).toBeFalsy();
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

		expect(checkInput({ flag1: ['dominik', 'thomas'] }, options).pass).toBeTruthy();
		expect(checkInput({ flag2: '' }, options).pass).toBeFalsy();
	});

	test('Invalid type is validated correctly', () => {
		const options = {
			flag1: {
				type: 'dominik',
			},
			flag2: {
				type: 'thomas',
			},
		};

		expect(checkInput({ flag1: 'mock' }, options).pass).toBeFalsy();
		expect(checkInput({ flag2: 'mock' }, options).pass).toBeFalsy();
	});

	test('Rouge flag is warned about', () => {
		const options = {
			flag1: {
				type: 'string',
			},
			flag2: {
				type: 'string',
			},
		};

		const result = checkInput({ flag3: 'mock' }, options);

		expect(result.warnings.length).toBe(1);
		expect(result.warnings[0].includes('flag3')).toBeTruthy();
	});
});
