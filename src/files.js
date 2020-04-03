/**
 * The files store
 *
 * @type {Object}
 */

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { DEBUG, D } = require('./log.js');
const { color } = require('./color.js');

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
 * Save Files function
 *
 * @return {type}  - Return a promise
 */
function saveFiles() {
	D.header('saveFiles');

	return new Promise((resolve, reject) => {
		LOADING.start = { total: FILES.get.size };

		D.log(`Settings: ${JSON.stringify(SETTINGS.get)}`);

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
			archive.on('warning', (err) => {
				result.code = 1;
				if (err.code === 'ENOENT') {
					result.errors.push(`Could not find file or directory: ${err}`);
				} else {
					result.errors.push(`Error archiving files: ${err}`);
				}
			});

			// catch errors
			archive.on('error', (err) => {
				result.code = 1;
				result.errors.push(`Error archiving files: ${err}`);
			});

			let zipOutput = null;

			// write to disk if output is provided
			if (SETTINGS.get.output) {
				// constract the path we'll be outputing the zip file to
				const outputPath = path.resolve(process.cwd(), SETTINGS.get.output);

				// create directory if it doesn't already exist
				if (!fs.existsSync(outputPath)) {
					fs.mkdirSync(outputPath, { recursive: true }, (err) => {
						if (err) {
							result.code = 1;
							result.errors.push(`Error creating directory: ${err}`);
							reject(result);
						}
					});
				}

				const zipPath = `${outputPath}/blender.zip`;
				zipOutput = fs.createWriteStream(zipPath);

				zipOutput.on('close', (err) => {
					if (err) {
						result.code = 1;
						result.errors.push(`Error archiving files: ${err}`);
					}
					D.log(`Zip file written to path: ${color.yellow(zipPath)}`);
					if (result.code === 1) {
						reject(result);
					} else {
						resolve(result);
					}
				});
			}

			FILES.get.forEach(({ name, path, content }) => {
				// append each file to the zip
				archive.append(content, { name: `${path}/${name}` }, 'utf-8');
				LOADING.tick();
			});

			// write output to file if saving to disk
			if (SETTINGS.get.output) {
				archive.pipe(zipOutput);
			}

			// finish off zip process
			archive.finalize();

			// if we aren't outputing it anywhere, just return the zip directly
			if (!SETTINGS.get.output) {
				LOADING.abort();
				result.files = [{ name: 'blender.zip', path: '', content: archive }];
				if (result.code === 1) {
					reject(result);
				} else {
					resolve(result);
				}
			}
		} else if (SETTINGS.get.output) {
			D.log(`Saving files`);

			const allFiles = [];

			FILES.get.forEach(async ({ name, path, content, category }) => {
				// save all files to a directory
				allFiles.push(writeFile(name, path, content));
				LOADING.tick();
			});

			Promise.all(allFiles)
				.then(() => {
					LOADING.abort();
					resolve(result);
				})
				.catch((err) => {
					reject(err);
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
 * Write the files
 *
 * @param  {type} fileName    - Name of the file
 * @param  {type} outputPath  - Where the file gets outputted
 * @param  {type} fileContent - Contents of the file
 * @return {type}             - Return a promise
 */
function writeFile(fileName, outputPath, fileContent) {
	const result = {
		code: 0,
		errors: [],
	};

	return new Promise((resolve, reject) => {
		// create directory if it doesn't already exist
		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath, { recursive: true }, (err) => {
				if (err) {
					result.code = 1;
					result.errors.push(`Error creating directory: ${err}`);
					reject(result);
				}
				resolve(result);
			});
		}

		// write file to specified outputPath with fileContent
		fs.writeFileSync(`${outputPath}/${fileName}`, fileContent, (err) => {
			if (err) {
				result.code = 1;
				result.errors.push(`Error outputting file: ${err}`);
				reject(result);
			}
			resolve(result);
		});
	});
}

module.exports = exports = {
	FILES,
	saveFiles,
	writeFile,
};
