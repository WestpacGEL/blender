/**
 * All functions for keeping debug state
 *
 * DEBUGdefaults - The DEBUG default values for the store
 * DEBUG         - DEBUG object for tracking debug mode, level, messages etc
 **/

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

module.exports = exports = {
	DEBUGdefaults,
	DEBUG,
};
