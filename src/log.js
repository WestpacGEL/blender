/**
 * All functions for logging to the console
 *
 * DEBUGdefaults - The DEBUG default values for the store
 * DEBUG         - DEBUG object for tracking debug mode, level, messages etc
 * D             - Debugging prettiness
 * log           - Logging prettiness
 **/
const { color } = require('./color.js');

/**
 * The DEBUG default values for the store
 *
 * @type {Object}
 */
const DEBUGdefaults = {
	mode: 'cli',
	enabled: false,
	errorCount: 0,
	messages: [],
	set: false,
	buffer: [],
};

/**
 * DEBUG object for tracking debug mode, level, messages etc
 *
 * @type {Object}
 */
const DEBUG = {
	store: { ...DEBUGdefaults },

	set mode(value) {
		this.store.mode = value;
	},
	get mode() {
		return this.store.mode;
	},

	set enabled(value) {
		this.store.set = true;
		this.store.enabled = value;
	},
	get enabled() {
		return this.store.enabled;
	},

	addError() {
		this.store.errorCount++;
	},
	get errorCount() {
		return this.store.errorCount;
	},

	set messages(value) {
		this.store.messages.push(value);
	},
	get messages() {
		return this.store.messages;
	},

	get set() {
		return this.store.set;
	},

	set buffer(value) {
		if (value) {
			this.store.buffer.push(value);
		} else {
			this.store.buffer = [];
		}
	},
	get buffer() {
		return this.store.buffer;
	},

	clean() {
		this.store = DEBUGdefaults;
	},
};

/**
 * Debugging prettiness
 *
 * @type {object}
 */
const D = {
	output(text, debug) {
		if (debug.set && debug.buffer.length && debug.enabled) {
			console.log(debug.buffer.join('\n'));
			debug.buffer = false;
		}

		if (!debug.set) {
			debug.buffer = text;
		} else if (debug.enabled) {
			console.log(text);
		}
	},

	/**
	 * Log a header for a function call
	 *
	 * @param  {string}  name  - The name of the function
	 * @param  {object}  args  - Arguments this function may have taken
	 * @param  {boolean} debug - Global debug mode on/off switch
	 */
	header(name, args, debug = DEBUG) {
		debug.messages =
			`${debug.messages.length > 0 ? '\n\n' : ''}   ===== RUNNING "${name}" =====\n` +
			`${args ? JSON.stringify(args) : ''}`;
		this.output(
			`\n===== RUNNING "${color.bold(name)}" =====${
				args ? `\n${color.cyan(JSON.stringify(args))}` : ''
			}`,
			debug
		);
	},

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	log(text, debug = DEBUG) {
		debug.messages = `🔎  ${text}`;
		this.output(`🔎  ${text}`, debug);
	},

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	error(text, debug = DEBUG) {
		debug.messages = `🛑  ${text}`;
		debug.addError();
		this.output(`🛑  ${color.red(text)}`, debug);
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
			console.info(color.gray(`☏  ${text}`));
		}
	},

	/**
	 * Log a success message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	success: (text) => {
		if (DEBUG.mode === 'cli') {
			console.log(color.green(`☀  ${text}`));
		}
	},

	/**
	 * Log a warning message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	warn: (text) => {
		if (DEBUG.mode === 'cli') {
			console.warn(color.yellow(`⚠  ${text}`));
		}
	},

	/**
	 * Log a error message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	error: (text) => {
		if (DEBUG.mode === 'cli') {
			console.error(color.red(`☁  ${text}`));
		}
	},
};

module.exports = exports = {
	DEBUG,
	D,
	log,
};
