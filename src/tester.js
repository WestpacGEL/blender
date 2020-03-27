/**
 * All functions for the blender tester
 *
 * tester - TODO
 **/
const { color } = require('./color.js');
const { D } = require('./log.js');

const tester = () => {
	D.header('tester');
	const result = {
		code: 0,
	};

	console.log('tester!');

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
};

module.exports = exports = {
	tester,
};
