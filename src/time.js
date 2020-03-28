/**
 * All functions for keeping time
 *
 * TIME          - Keeping time
 * convertHrtime - Convert hrtime to seconds
 **/

/**
 * Keeping time
 *
 * @type {Object}
 */
const TIME = {
	store: {
		time: [],
	},

	start() {
		this.store.time = process.hrtime();
	},

	stop() {
		const elapsedTime = process.hrtime(this.store.time);
		return `${convertHrtime(elapsedTime)}s`;
	},

	clean() {
		this.store.time = [];
	},
};

/**
 * Convert hrtime to seconds
 *
 * @param {array} elapsedTime - The elapsed time started and stopped with process.hrtime
 */
const convertHrtime = (elapsedTime) => {
	if (Array.isArray(elapsedTime)) {
		return (elapsedTime[0] + elapsedTime[1] / 1e9).toFixed(3);
	} else {
		return elapsedTime;
	}
};

module.exports = exports = {
	TIME,
	convertHrtime,
};
