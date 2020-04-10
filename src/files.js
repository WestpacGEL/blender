/**
 * All functions to store and save files
 *
 * FILES     - The files store
 * saveFiles - Save Files as zip or individually to disk or return
 * writeFile - Write a file to a directory
 * createDir - Create all directories within a given path
 **/
const path = require('path');
const fs = require('fs');

const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { DEBUG } = require('./debug.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * The files store
 *
 * @type {Object}
 */
const FILES = {
	store: new Map(),

	get get() {
		return this.store;
	},

	set add({ name, filePath = '', dir, ...rest }) {
		this.store.set(path.normalize(`${dir}/${name}`), {
			name,
			filePath,
			dir,
			...rest,
		});
	},

	clean() {
		this.store.clear();
	},
};

/**
 * Save Files as zip or individually to disk or return
 *
 * @return {promise object}  - Return a promise
 */
function saveFiles() {
	D.header('saveFiles');

	return new Promise((resolve, reject) => {
		LOADING.start = {
			total: FILES.get.size,
			minTotal: 300,
		};

		const result = {
			code: 0,
			errors: [],
		};

		const allFiles = [];

		// save all files to a directory
		FILES.get.forEach(async (pack) => {
			D.log(`Saving file ${color.yellow(pack.name)} to ${color.yellow(pack.dir)}`);
			try {
				allFiles.push(await writeFile(pack));
			} catch (error) {
				reject(error);
			}

			LOADING.tick();
		});

		Promise.all(allFiles)
			.then(() => {
				D.log(`All ${color.yellow(allFiles.length)} files saved`);
				LOADING.abort();
				resolve(result);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

/**
 * Write a file to a directory
 *
 * @param  {string} options.name     - Name of the file
 * @param  {string} options.filePath - Path of the file
 * @param  {string} options.dir      - Path of the file
 * @param  {string} options.content  - Contents of the file
 *
 * @return {promise object}          - An object with code and an error array
 */
function writeFile({ name, filePath, dir, content }) {
	const result = {
		code: 0,
		errors: [],
	};
	const outputPath = path.normalize(`${dir}/${filePath}`);

	return new Promise((resolve, reject) => {
		// create directory if it doesn't already exist
		const dirCreation = createDir(outputPath);
		if (dirCreation !== 'success') {
			result.code = 1;
			result.errors.push(dirCreation);
			reject(result);
		}

		// write file to specified outputPath with content
		fs.writeFile(path.normalize(`${outputPath}/${name}`), content, (error) => {
			if (error) {
				result.code = 1;
				result.errors.push(`Error outputting file: ${error}`);
				reject(result);
			}
			resolve(result);
		});
	});
}

/**
 * Create all directories within a given path
 *
 * @param  {string} dirPath - The path to the directory that needs creation
 *
 * @return {string}         - An error string or "success"
 */
function createDir(dirPath) {
	D.header('createDir', { dirPath });

	if (!fs.existsSync(dirPath)) {
		D.log(`Creating directory ${color.yellow(dirPath)}`);

		fs.mkdirSync(dirPath, { recursive: true }, (error) => {
			if (error) {
				return `Creating directory ${color.yellow(dirPath)} failed\n${error}`;
			}
		});
		return 'success';
	} else {
		return 'success';
	}
}

module.exports = exports = {
	FILES,
	saveFiles,
	writeFile,
	createDir,
};
