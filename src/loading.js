/**
 * All functions to display loading state
 *
 * LOADING - Display a loading indicator in cli
 **/
const winSize = require('window-size');

const { DEBUG } = require('./debug.js');

/**
 * Display a loading indicator in cli
 *
 * @type {Object}
 */
const LOADING = {
	const: {
		spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
		done: '▓',
		todo: '░',
		left: '',
		right: '',
	},

	store: {},

	set start({ total, ...options }) {
		this.store = {
			...this.const,
			...options,
			total,
			bufferLeft: '   ',
			current: 0,
			index: 0,
			timeout: -1,
			interval: -1,
			mode: 'spinner',
		};

		clearTimeout(this.store.timeout);
		clearInterval(this.store.interval);

		this.store.timeout = setTimeout(() => {
			clearInterval(this.store.interval);
			this.store.mode = 'bar';
			this.bar();
		}, 2000);

		this.store.interval = setInterval(() => this.spinner(), 50);
	},

	tick() {
		this.store.current++;
		if (this.store.current === this.store.total) {
			this.abort(); // erase all traces of this thing and free memory
		} else {
			this.bar();
		}
	},

	spinner() {
		this.clear();
		process.stdout.write(
			`${this.store.bufferLeft}${this.store.spinner[this.store.index]}\u001b[1G`
		);

		this.store.index++;
		if (this.store.index >= this.store.spinner.length) {
			this.store.index = 0;
		}
	},

	bar() {
		if (
			this.store.mode === 'bar' &&
			DEBUG.mode === 'cli' &&
			this.store.current <= this.store.total &&
			!DEBUG.enabled
		) {
			this.clear();

			const bufferRight = 8;
			const percentage = String(Math.floor((this.store.current / this.store.total) * 100));
			const winSizeW = winSize ? winSize.width : 80;
			const width =
				winSizeW -
				this.store.left.length -
				this.store.bufferLeft.length -
				bufferRight -
				this.store.right.length;
			const segment = width / this.store.total;
			const current = this.store.current > 0 ? Math.floor(segment * this.store.current) : 0;

			process.stdout.write(
				this.store.bufferLeft + // some space for breathing
					this.store.left +
					(current > 0 ? this.store.done.repeat(current) : '').padEnd(width, this.store.todo) + // the indicator bar
					this.store.right +
					' ' + // some space for breathing
					percentage.padStart(3, ' ') + // the percentages
					'%' + // I have to add these comments because "prettier" is really "uglier"
					'\u001b[1G' // this moves the cursor to the start of the line
				// ^ like why is the last line indented? WHY???
			);
		}
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

	abort() {
		clearTimeout(this.store.timeout);
		clearInterval(this.store.interval);
		this.clear();
		this.clean();
	},
};

module.exports = exports = {
	LOADING,
};
