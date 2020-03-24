const { color } = require('./color.js');

/**
 * DEBUG object for tracking debug mode, level and messages
 *
 * @type {Object}
 */
const DEBUG = {
	store: {
		enabled: false,
		errors: 0,
		messages: [],
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
				`\n\n===== RUNNING "${color.bold(name)}" =====\n`,
				color.green(JSON.stringify(args, null, '\t')),
				'\n'
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

module.exports = exports = {
	DEBUG,
	D,
};
