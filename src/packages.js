/**
 * All functions for around packages
 *
 * getComponents - Handle exiting of program
 **/
const path = require('path');
const fs = require('fs');

const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { log } = require('./log.js');
const { D } = require('./log.js');

/**
 * Retrieve packages from the node_modules folder
 *
 * @return {array} - An array of objects with package data
 */
function getPackages(cwd = process.cwd()) {
	D.header('getComponents', { cwd });

	const nodeModulesPath = path.normalize(`${cwd}/node_modules/`);

	const inScope = fs
		.readdirSync(path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}`), {
			withFileTypes: true,
		}) // read all items in that folder
		.filter((item) => !item.name.startsWith('.') && item.isDirectory()) // filter out dot files and non-folder
		.map((folder) => path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}/${folder.name}`)); // add absolute path

	D.log(`Retrived in scope packages: "${color.yellow(JSON.stringify(inScope))}"`);

	const includes = (Array.isArray(SETTINGS.get.include)
		? SETTINGS.get.include
		: [SETTINGS.get.include]
	).map((module) => path.normalize(`${nodeModulesPath}/${module}`));

	D.log(`Retrived in included packages: "${color.yellow(JSON.stringify(includes))}"`);

	const packages = [...inScope, ...includes] // merging both sets
		.filter(
			(module) =>
				!(Array.isArray(SETTINGS.get.exclude)
					? SETTINGS.get.exclude
					: [SETTINGS.get.exclude]
				).includes(module.replace(nodeModulesPath, ''))
		) // filtered out all excludes
		.map((module) => {
			let pkg = { blender: false };
			try {
				pkg = require(`${module}/package.json`);
			} catch (error) {
				log.warn(
					`The package "${color.yellow(module.replace(nodeModulesPath, ''))}" could not be found.`
				);
			}
			return {
				path: module,
				pkg: pkg.blender,
			};
		}) // added each package.json blender section
		.filter((module) => module.pkg); // remove all packages which don't support the blender

	D.log(`getComponents return: "${color.yellow(JSON.stringify(packages))}"`);

	return packages;
}

module.exports = exports = {
	getPackages,
};
