/**
 * Keeping time
 *
 * @type {Object}
 */
const time = {
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
};

/**
 * Convert hrtime to seconds
 *
 * @param {array} elapsedTime - The elapsed time started and stopped with process.hrtime
 */
export const convertHrtime = (elapsedTime) => {
	if (Array.isArray(elapsedTime)) {
		return (elapsedTime[0] + elapsedTime[1] / 1e9).toFixed(3);
	} else {
		return elapsedTime;
	}
};

module.exports = exports = {
	time,
	convertHrtime,
};
