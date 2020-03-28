/**
 * All functions for the blender tester
 *
 * tester - TODO
 **/
const { color } = require('./color.js');
const { D } = require('./log.js');

function tester(packages) {
	D.header('tester');
	const result = {
		code: 0,
		errors: [],
	};

	console.log(packages);
	// loop over `packages.map()`
	// parse css and html `await parseComponent`
	// iterate `ids`
	// checks if the `id` exists in the css output
	// checks if hash is different for same label
	// return which ones have errors (what component and what flags)

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

module.exports = exports = {
	tester,
};
