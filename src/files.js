/**
 * All functions to store and save files
 *
 * FILES     - The files store
 * saveFiles - Save Files as zip or individually to disk or return
 * writeFile - Write a file to a directory
 * createDir - Create all directories within a given path
 **/
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { DEBUG, D } = require('./log.js');
const { color } = require('./color.js');

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

	set add({ name, path, ...rest }) {
		this.store.set(`${path}/${name}`, {
			name,
			path,
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

		// handle zip files
		if (SETTINGS.get.outputZip) {
			D.log(`Generating zip file`);

			// create an archiver instance
			const archive = archiver('zip');

			// catch warnings
			archive.on('warning', (error) => {
				result.code = 1;
				if (err.code === 'ENOENT') {
					result.errors.push(`Could not find file or directory: ${error}`);
				} else {
					result.errors.push(`Error archiving files: ${error}`);
				}
			});

			// catch errors
			archive.on('error', (error) => {
				result.code = 1;
				result.errors.push(`Error archiving files: ${error}`);
			});

			let zipOutput = null;

			// write to disk if output is provided
			if (SETTINGS.get.output) {
				D.log(`Writing zip to disk`);

				// construct the path we'll be outputting the zip file to
				const outputPath = path.resolve(process.cwd(), SETTINGS.get.output);

				// create directory if it doesn't already exist
				const dirCreation = createDir(outputPath);
				if (dirCreation !== 'success') {
					result.code = 1;
					result.errors.push(dirCreation);
					reject(result);
				}

				const zipPath = `${outputPath}/blender.zip`;
				zipOutput = fs.createWriteStream(zipPath);

				zipOutput.on('close', (error) => {
					if (error) {
						result.code = 1;
						result.errors.push(`Error archiving files: ${error}`);
					}
					D.log(`Zip file written to path: ${color.yellow(zipPath)}`);
					if (result.code === 1) {
						reject(result);
					} else {
						resolve(result);
					}
				});
			}

			// append each file to the zip
			FILES.get.forEach(({ name, path, content }) => {
				D.log(`Appending ${color.yellow(name)} to zip archive`);
				archive.append(content, { name: `${path}/${name}` }, 'utf-8');
				LOADING.tick();
			});

			// write output to file if saving to disk
			if (SETTINGS.get.output) {
				archive.pipe(zipOutput);
			}

			// finish off zip process
			archive.finalize();

			// if we aren't outputting it anywhere, just return the zip directly
			if (!SETTINGS.get.output) {
				D.log(`Zip not saved but returned`);

				LOADING.abort();
				result.files = [{ name: 'blender.zip', path: '', content: archive }];
				if (result.code === 1) {
					reject(result);
				} else {
					resolve(result);
				}
			}
		} else if (
			SETTINGS.get.output ||
			SETTINGS.get.outputCss ||
			SETTINGS.get.outputJs ||
			SETTINGS.get.outputToken ||
			SETTINGS.get.outputHtml
		) {
			D.log(`Saving files individually`);

			const allFiles = [];

			// save all files to a directory
			FILES.get.forEach(async ({ name, path, content }) => {
				D.log(`Saving file ${color.yellow(name)} to ${color.yellow(path)}`);
				try {
					allFiles.push(await writeFile(name, path, content));
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
		} else {
			D.log(`Returning files directly`);
			LOADING.abort();

			result.files = FILES.get;
			resolve(result);
		}
	});
}

/**
 * Write a file to a directory
 *
 * @param  {string} fileName    - Name of the file
 * @param  {string} outputPath  - Path of the file
 * @param  {string} fileContent - Contents of the file
 *
 * @return {promise object}     - An object with code and an error array
 */
function writeFile(fileName, outputPath, fileContent) {
	const result = {
		code: 0,
		errors: [],
	};

	return new Promise((resolve, reject) => {
		// create directory if it doesn't already exist
		const dirCreation = createDir(outputPath);
		if (dirCreation !== 'success') {
			result.code = 1;
			result.errors.push(dirCreation);
			reject(result);
		}

		// write file to specified outputPath with fileContent
		fs.writeFile(`${outputPath}/${fileName}`, fileContent, (error) => {
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
