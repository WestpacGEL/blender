/**
 * All functions for the generator
 *
 * generateJSFile - Generates all the javascript
 * convertVersion - Convert versions in js and html
 **/
const path = require('path');
const fs = require('fs');

const { version } = require('../package.json');
const { SETTINGS } = require('./settings.js');
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

	result.js = `/*! ${pkg.name} v${
		pkg.version
	} blended with blender v${version} */\n${convertVersion(result.js, pkg.version)}`;

	return result;
}

/**
 * Convert versions in js and html
 *
 * @param  {string} text    - The text to be stripped of __version__
 * @param  {string} version - The version
 *
 * @return {string}         - The converted text
 */
function convertVersion(text, version) {
	const replacement = SETTINGS.get.versionInClass ? `-v${version.replace(/\./g, '_')}` : '';
	return String(text).replace(/__version__/g, replacement);
}

module.exports = exports = {
	convertVersion,
	generateJSFile,
};
