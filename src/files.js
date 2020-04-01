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

function saveFiles() {
	D.header('saveFiles');

	return new Promise((resolve, reject) => {

		LOADING.start = { total: FILES.get.size };

		// testing overrides
		// SETTINGS.set = { outputZip: true, output: '/' };
		// SETTINGS.set = { output: 'test' };
		// SETTINGS.set = {
		// 	outputCss: 'test/css',
		// 	outputJs: 'test/js',
		// 	outputHtml: 'test/html',
		// 	outputTokens: 'test/tokens',
		// };

		// D.log(`Settings: ${JSON.stringify(SETTINGS.get)}`);

		const result = {
			code: 0,
			errors: [],
		};

		// handle zip files
		if (SETTINGS.get.outputZip) {
			D.log(`Generating zip file`);

			// create an archiver instance we can add to if we're zipping the files
			const zipPath = path.resolve(process.cwd(),`${SETTINGS.get.output}/blender.zip`);
			const output = SETTINGS.get.output ? fs.createWriteStream(zipPath) : null;
			const archive = archiver('zip');

			// listen for archive data to be written to disk
			if (output) {
				output.on('close', (err) => {
					if (err) {
						result.code = 1;
						result.errors.push(`Error archiving files: ${err}`);
					}
					D.log(`Zip file written to: ${color.yellow(zipPath)}`);
					console.log(`Zip file written to: ${color.yellow(zipPath)}`);
					if (result.code === 1) {
						reject(result);
					} else {
						resolve(result);
					}
				});
			}

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

			FILES.get.forEach(({ name, path, content }) => {
				// append each file to the zip
				archive.append(content, { name: `${path}/${name}` }, 'utf-8');

				LOADING.tick();
			});

			// write output to file if saving to disk
			if (output) {
				archive.pipe(output);
			}

			// finish off zip process
			archive.finalize();

			// if we aren't outputing it anywhere, just return the zip directly
			if (!output) {
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
			SETTINGS.get.outputHtml ||
			SETTINGS.get.outputTokens
		) {

			D.log(`Saving files`);

			const allFiles = [];

			FILES.get.forEach(async ({ name, path, content, category }) => {

				// save all files to a directory
				if (SETTINGS.get.output) {
					allFiles.push(writeFile(name, SETTINGS.get.output, content));
				}
				// save styles
				else if (SETTINGS.get.outputCss && category === 'css') {
					allFiles.push(writeFile(name, SETTINGS.get.outputCss, content));
				}
				// save javascript
				else if (SETTINGS.get.outputJs && category === 'js') {
					allFiles.push(writeFile(name, SETTINGS.get.outputJs, content));
				}
				// save html
				else if (SETTINGS.get.outputHtml && category === 'html') {
					allFiles.push(writeFile(name, SETTINGS.get.outputHtml, content));
				}
				// save tokens
				else if (SETTINGS.get.outputTokens && category === 'token') {
					allFiles.push(writeFile(name, SETTINGS.get.outputTokens, content));
				}

				LOADING.tick();

			});

			Promise.all(allFiles).then(() => {
				LOADING.abort();
				resolve(result);
			}).catch((err) => {
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

function writeFile(name, path, content) {

	const result = {
		code: 0,
		errors: [],
	};

	return new Promise((resolve, reject) => {

		// create directory if it doesn't already exist
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true }, (err) => {
				if (err) {
					result.code = 1;
					result.errors.push(`Error creating directory: ${err}`);
					reject(result);
				}
				resolve(result);
			});
		}

		// write file to specified path with content
		fs.writeFileSync(`${path}/${name}`, content, (err) => {
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
