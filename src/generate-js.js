/**
 * generateJSFile - Generates all the javascript
 *
 * @param  {type} pkg - The package object with blender key
 * @return {type}     - A result object with a js key
 */
const path = require('path');
const fs = require('fs');

const { color } = require('./color.js');
const { D } = require('./log.js');

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

	return result;
}

module.exports = exports = {
	generateJSFile,
};
