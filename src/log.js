/**
 * All functions for logging to the console
 *
 * DEBUG - DEBUG object for tracking debug mode, level and messages
 * D     - Debugging prettiness
 * log   - Logging prettiness
 **/
const { color } = require('./color.js');

/**
 * DEBUG object for tracking debug mode, level and messages
 *
 * @type {Object}
 */
const DEBUG = {
	store: {
		mode: 'cli',
		enabled: false,
		errors: 0,
		messages: [],
	},

	set mode(value) {
		this.store.mode = value;
	},
	get mode() {
		return this.store.mode;
	},

	set enabled(value) {
		this.store.enabled = value;
	},
	get enabled() {
		return this.store.enabled;
	},

	addError() {
		this.store.errors++;
	},
	get errors() {
		return this.store.errors;
	},

	set messages(value) {
		this.store.messages.push(value);
	},
	get messages() {
		return this.store.messages;
	},
};

/**
 * Debugging prettiness
 *
 * @type {object}
 */
const D = {
	/**
	 * Log a header for a function call
	 *
	 * @param  {string}  name  - The name of the function
	 * @param  {array}   args  - Arguments this function may have taken
	 * @param  {boolean} debug - Global debug mode on/off switch
	 */
	header: (name, args = [], debug = DEBUG.enabled) => {
		DEBUG.messages =
			`${DEBUG.messages.length > 0 ? '\n\n' : ''}   ===== RUNNING "${name}" =====\n` +
			`${JSON.stringify(args)}`;

		if (debug) {
			console.log(
				`\n===== RUNNING "${color.bold(name)}" =====\n${color.green(JSON.stringify(args))}`
			);
		}
	},

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	log: (text, debug = DEBUG.enabled) => {
		DEBUG.messages = text;

		if (debug) {
			console.log(`🔎  ${text}`);
		}
	},

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	error: (text, debug = DEBUG.enabled) => {
		DEBUG.messages = `ERROR: ${text}`;
		DEBUG.addError();

		if (debug) {
			console.error(`🛑  ${color.red(text)}`);
		}
	},
};

/**
 * Logging prettiness
 *
 * @type {object}
 */
const log = {
	/**
	 * Log the start message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	start: (text) => {
		if (DEBUG.mode === 'cli') {
			console.log(`\n   ${color.bold(text)}`);
		}
	},

	/**
	 * Log an informal message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	info: (text) => {
		if (DEBUG.mode === 'cli') {
			console.info(`💡  ${text}`);
		}
	},

	/**
	 * Log a success message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	success: (text) => {
		if (DEBUG.mode === 'cli') {
			console.log(`🚀  ${color.green(text)}`);
		}
	},

	/**
	 * Log a warning message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	warn: (text) => {
		if (DEBUG.mode === 'cli') {
			console.warn(`⚠️  ${color.yellow(text)}`);
		}
	},

	/**
	 * Log a error message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	error: (text) => {
		if (DEBUG.mode === 'cli') {
			console.error(`🛑  ${color.red(text)}`);
		}
	},
};

module.exports = exports = {
	DEBUG,
	D,
	log,
};
