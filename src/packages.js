/**
 * All functions for around packages
 *
 * PACKAGES    - The packages store
 * getPackages - Retrieve packages from the node_modules folder
 **/
const path = require('path');
const fs = require('fs');

const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { log } = require('./log.js');
const { D } = require('./log.js');

/**
 * The packages store
 *
 * @type {Object}
 */
const PACKAGES = {
	store: [],

	get get() {
		return this.store;
	},
	set set(settings) {
		this.store = settings;
	},

	clean() {
		this.store = [];
	},
};

/**
 * Retrieve packages from the node_modules folder
 *
 * @return {array} - An array of objects with package data
 */
function getPackages(cwd = process.cwd()) {
	D.header('getPackages', { cwd });

	const nodeModulesPath = path.normalize(`${cwd}/node_modules/`);

	let inScope = [];
	try {
		inScope = fs
			.readdirSync(path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}`), {
				withFileTypes: true,
			}) // read all items in that folder
			.filter((item) => !item.name.startsWith('.') && item.isDirectory()) // filter out dot files and non-folder
			.map((folder) => path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}/${folder.name}`)); // add absolute path
	} catch (error) {
		if (error.code === 'ENOENT') {
			D.log('No scope found');
			D.log(error);
		} else {
			D.error(
				`Something went wrong when trying to read packages at ${color.yellow(
					`${nodeModulesPath}/${SETTINGS.get.scope}`
				)}`
			);
			D.error(error);
		}
	}

	D.log(`Retrived in scope packages: "${color.yellow(JSON.stringify(inScope))}"`);

	const includes = SETTINGS.get.include.map((module) =>
		path.normalize(`${nodeModulesPath}/${module}`)
	);

	D.log(`Retrived in included packages: "${color.yellow(JSON.stringify(includes))}"`);

	const packages = [...inScope, ...includes] // merging both sets
		.filter((module) => !SETTINGS.get.exclude.includes(module.replace(nodeModulesPath, ''))) // filtered out all excludes
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
				name: pkg.name,
				path: module,
				pkg: pkg.blender,
			};
		}) // added each package.json blender section
		.filter((module) => module.pkg); // remove all packages which don't support the blender

	D.log(`getPackages return: "${color.yellow(JSON.stringify(packages))}"`);

	// we need to flag all packages with babel to include them
	require('@babel/register')({ include: packages.map((pkg) => pkg.path) });

	return packages;
}

module.exports = exports = {
	PACKAGES,
	getPackages,
};
