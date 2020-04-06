/**
 * All functions to display loading state
 *
 * LOADING - Display a loading indicator in cli
 **/
const winSize = require('window-size');

const { color } = require('./color.js');
const { DEBUG } = require('./log.js');

/**
 * Display a loading indicator in cli
 *
 * @type {Object}
 */
const LOADING = {
	const: {
		minTotal: 30,
		done: '▓',
		todo: '░',
		left: '',
		right: '',
	},

	store: {},

	set start({ total, ...options }) {
		this.store = { ...this.const, ...options, total, current: 0 };
		this.display(true);
	},

	tick() {
		this.store.current++;
		this.display();
	},

	display(firstRun = false) {
		if (
			this.store.total > this.store.minTotal &&
			DEBUG.mode === 'cli' &&
			this.store.current <= this.store.total &&
			!DEBUG.enabled
		) {
			if (!firstRun) {
				this.clear();
			}

			const bufferLeft = '   ';
			const bufferRight = 8;
			const percentage = String(Math.floor((this.store.current / this.store.total) * 100));
			const width =
				winSize.width -
				this.store.left.length -
				bufferLeft.length -
				bufferRight -
				this.store.right.length;
			const segment = width / this.store.total;
			const current = this.store.current > 0 ? Math.floor(segment * this.store.current) : 0;

			process.stdout.write(
				bufferLeft + // some space for breathing
				this.store.left +
				(current > 0 ? this.store.done.repeat(current) : '').padEnd(width, this.store.todo) + // the indicator bar
				this.store.right +
				' ' + // some space for breathing
				percentage.padStart(3, ' ') + // the percentages
					'%' // I have to add these comments because "prettier" is really "uglier"
				// ^ like why is this last line indented? WHY???
			);

			if (this.store.current === this.store.total) {
				this.abort(); // erase all traces of this thing and free memory
			}
		}
	},

	abort() {
		this.clear();
		this.clean();
	},

	clear() {
		process.stdout.write(
			'\u001b[2K' + '\u001b[1G'
			// ^ clear line // ^ reset cursor to start
		);
	},

	clean() {
		this.store = {};
	},
};

module.exports = exports = {
	LOADING,
};
