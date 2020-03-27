/**
 * Settings from defaults, package.json and cli
 *
 * SETTINGS      - The settings store
 * getSettings   - Get the settings from the package.json, the cli and our defaults value and merge them all together
 * getDefaults   - Get the default values from our options
 * camelCase     - Convert a string to camel case
 * getPkgOptions - Get the blender settings from the package.json
 * getCliArgs    - Parse our cli options into an easily digestible object
 * checkCliInput - Check the cli input and log out helpful errors messages
 **/
const path = require('path');
const fs = require('fs');

const { CLIOPTIONS } = require('./const.js');
const { color } = require('./color.js');
const { D, log } = require('./log.js');

/**
 * The settings store
 *
 * @type {Object}
 */
const SETTINGS = {
	store: {},

	get get() {
		return this.store;
	},
	set set(settings) {
		this.store = settings;
	},
};

/**
 * Get the settings from the package.json, the cli and our defaults value and merge them all together
 *
 * @param  {object} cliArgs - The parsed cli flags
 * @param  {string} cwd     - The current working directory
 * @param  {object} options - The options for this program
 *
 * @return {object}         - The settings object with all merged
 */
function getSettings(cliArgs, cwd = process.cwd(), options = CLIOPTIONS) {
	D.header('getSettings', { cliArgs, cwd });

	const defaults = getDefaults(options);
	const pkgOptions = getPkgOptions(cwd);

	const settings = { ...defaults, ...pkgOptions, ...cliArgs };

	D.log(`getSettings return: "${color.yellow(JSON.stringify(settings))}"`);

	return settings;
}

/**
 * Get the default values from our options
 *
 * @param  {object} options - The defaults options object
 *
 * @return {object}         - An object of only the items with default values
 */
function getDefaults(options) {
	D.header('getDefaults', { options });
	const defaults = {};

	Object.entries(options).map(([option, value]) => {
		if (typeof value.default !== 'undefined') {
			defaults[camelCase(option)] = value.default;
		}
	});

	D.log(`getDefaults return: "${color.yellow(JSON.stringify(defaults))}"`);

	return defaults;
}

/**
 * Convert a string to camel case
 *
 * @param  {string} name - The string to be converted
 *
 * @return {string}      - Camel-cased string
 */
function camelCase(name) {
	return typeof name === 'string'
		? name
				.split('-')
				.map((bit, i) => {
					if (i > 0) {
						return bit.charAt(0).toUpperCase() + bit.slice(1);
					}
					return bit;
				})
				.join('')
		: name;
}

/**
 * Get the blender settings from the package.json
 *
 * @param  {string} cwd - The current working directory
 *
 * @return {object}     - The settings object from the package.json
 */
function getPkgOptions(cwd) {
	D.header('getPkgOptions', { cwd });

	const pkgPath = path.normalize(`${cwd}/package.json`);
	let pkgSettings;
	try {
		pkgSettings = require(pkgPath).blender;
		D.log(`Found package.json at "${color.yellow(pkgPath)}"`);
	} catch (error) {
		D.error(`Unable to find package.json at "${color.yellow(pkgPath)}"`);
		log.info(`No package.json file found at "${color.yellow(pkgPath)}"`);
	}

	D.log(`getPkgOptions return: "${color.yellow(JSON.stringify(pkgSettings))}"`);

	return pkgSettings || {};
}

/**
 * Parse our cli options into an easily digestible object
 *
 * @param  {object} options   - The options object with names for each option as key and an optional flag key
 * @param  {array}  inputArgs - The array of our cli options of which the first two are ignored
 *
 * @return {object}           - A shallow 1-level deep object
 */
function getCliArgs(options = CLIOPTIONS, inputArgs = process.argv) {
	D.header('getCliArgs', { options, inputArgs });

	const argDict = {};
	Object.entries(options).map(([name, value]) => {
		argDict[`--${name}`] = name;
		if (value.flag) {
			argDict[`-${value.flag}`] = name;
		}
	});
	D.log(`Created arguments dictonary: "${color.yellow(JSON.stringify(argDict))}"`);

	const cliArgs = {};
	let currentFlag = '';
	inputArgs
		.slice(2) // ignore the first two items as first is path to node binary and second is path to node script (this one)
		.map((arg) => {
			// catch all full size flags "--version", "--debug" and all single short flags "-v", "-d"
			if (arg.startsWith('--') || (arg.startsWith('-') && arg.length === 2)) {
				currentFlag = camelCase(argDict[arg]) || arg;
				cliArgs[currentFlag] = true;
			}
			// catch all combined short flags "-xyz"
			else if (arg.startsWith('-')) {
				arg
					.slice(1) // remove the "-"       -> "xyz"
					.split('') // split into each flag -> ["x","y","z"]
					.map((flag) => {
						currentFlag = camelCase(argDict[`-${flag}`]) || `-${flag}`;
						cliArgs[currentFlag] = true;
					});
			}
			// catch all values passed to flags
			else {
				if (currentFlag === '') {
					D.error(`Found value without flag: "${color.yellow(arg)}"`);
					log.warn(
						`The cli argument "${color.bold(
							arg
						)}" has no preceding flags and therefore can't be categorized`
					);
				} else {
					if (Array.isArray(cliArgs[currentFlag])) {
						cliArgs[currentFlag].push(arg);
					} else if (typeof cliArgs[currentFlag] === 'string') {
						cliArgs[currentFlag] = [cliArgs[currentFlag], arg];
					} else {
						cliArgs[currentFlag] = arg;
					}
				}
			}
		});

	D.log(`getCliArgs return: "${color.yellow(JSON.stringify(cliArgs))}"`);

	return cliArgs;
}

/**
 * Check the cli input and log out helpful errors messages
 *
 * @param  {object} cliArgs - The parsed cli flags
 * @param  {object} options - The defaults options object
 *
 * @return {object}         - An object with errors and a boolean check
 */
function checkCliInput(cliArgs, options = CLIOPTIONS) {
	const result = {
		pass: true,
		errors: [],
	};

	const argDict = {};
	Object.entries(options).map(([key, value]) => {
		argDict[camelCase(key)] = options[key];
	});

	Object.entries(cliArgs).map(([key, value]) => {
		if (options[key]) {
			console.log(`option found [${key}] for value [${value}]`);

			// check types and check that the value matches at least one
			if (
				options[key].type === 'array' ? !Array.isArray(value) : typeof value !== options[key].type
			) {
				D.error(`Type mismatch found for "${color.yellow(key)}". Expected ${color.yellow(options[key].type)} but received ${color.yellow(typeof value)}`);
				result.pass = false;
				result.errors.push(`The input ${color.yellow(value)} was expected to be ${color.yellow(options[key].type)}`);
			}

			// if we only support specific arguments for an option, make sure the one
			// we're passing in is one we expect
			if (
				options[key].arguments &&
				Array.isArray(options[key].arguments) &&
				!options[key].arguments.includes(value)
			) {
				result.pass = false;
				result.errors.push(
					`The input ${color.yellow(value)} does not match any of the valid arguments ${color.yellow(options[key].arguments)}`
				);
			}
		} else {
			log.warn(`The option ${color.yellow(key)}] didn't watch any of blenders options and was ignored`);
		}
	});

	D.log(`checkCliInput return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

module.exports = exports = {
	SETTINGS,
	getSettings,
	camelCase,
	getPkgOptions,
	getCliArgs,
	checkCliInput,
};
