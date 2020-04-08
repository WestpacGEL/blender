/**
 * All functions for the generator
 *
 * generateJSFile - Generates all the javascript
 **/
const path = require('path');
const fs = require('fs');

const { version } = require('../package.json');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Generates all the javascript
 *
 * @param  {object} pkg - The package object with blender key
 *
 * @return {object}     - A result object with a js key
 */
function generateJSFile(pkg) {
	D.header('generateJSFile', { pkg });
	const pkgPath = path.normalize(`${pkg.path}/${pkg.pkg.js}`);

	const result = {
		code: 0,
		message: '',
	};

	try {
		result.js = fs.readFileSync(pkgPath);
		D.log(`Found file at "${color.yellow(pkgPath)}"`);
	} catch (error) {
		result.code = 1;
		result.message = `An error occured when trying to open ${color.yellow(pkgPath)}`;
		D.error(`Unable to find ${pkg.pkg.js} at "${color.yellow(pkg.path)}"`);
	}

	result.js = `/*! ${pkg.name} v${pkg.version} blended with blender v${version} */\n${result.js}`;

	return result;
}

module.exports = exports = {
	generateJSFile,
};
