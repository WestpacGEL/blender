/**
 * generateJSFile - Generates all the javascript
 *
 * @param  {type} pkg - The package object with blender key
 * @return {type}     - A result object with a js key
 */
const path = require('path');
const fs = require('fs');

const { color } = require('./color.js');
const { D, log } = require('./log.js');

function generateJSFile(pkg) {
	const pkgPath = path.normalize(`${pkg.path}/${pkg.pkg.jquery}`);

	let js = null;

	try {
		js = fs.readFileSync(pkgPath);
		D.log(`Found file at "${color.yellow(pkgPath)}"`);
	} catch (error) {
		D.error(`Unable to find script.js at "${color.yellow(pkgPath)}"`);
	}

	return { js };
}

module.exports = exports = {
	generateJSFile,
};
