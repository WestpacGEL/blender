/**
 * The files store
 *
 * @type {Object}
 */

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

function sleep(millis) {
	return new Promise((resolve) => setTimeout(resolve, millis));
}

FILES.add = {
	name: 'thing1.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing2.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing3.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing4.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing5.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing6.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing7.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing8.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing9.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing10.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing11.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing12.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing13.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing14.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing15.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing16.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing17.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing18.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing19.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing20.js',
	path: 'path/to',
	content: "alert('Hello World');",
	category: 'js',
};
FILES.add = {
	name: 'thing21.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing22.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing23.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing24.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing25.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing26.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing27.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing28.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing29.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing30.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing31.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing32.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing33.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing34.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing35.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing36.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing37.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing38.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing39.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing40.css',
	path: 'path/to',
	content: 'body { background red; }',
	category: 'css',
};
FILES.add = {
	name: 'thing41.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing42.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing43.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing44.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing45.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing46.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing47.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing48.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing49.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing50.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing51.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing52.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing53.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing54.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing55.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing56.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing57.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing58.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing59.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'thing60.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
	category: 'html',
};
FILES.add = {
	name: 'token.json',
	path: 'path/to',
	content: '{"bg": "#bada55"}',
	category: 'token',
};
FILES.add = {
	name: 'token.css',
	path: 'path/to',
	content: 'root{--bg:#bada55;}',
	category: 'token',
};
FILES.add = {
	name: 'token.less',
	path: 'path/to',
	content: '@bg: #bada55;',
	category: 'token',
};
FILES.add = {
	name: 'token.sass',
	path: 'path/to',
	content: '$bg: "#bada55";',
	category: 'token',
};

function saveFiles() {
	return new Promise(async (resolve, reject) => {

		DEBUG.enabled = true; // SETTINGS.get.debug;

		D.header('saveFiles');

		LOADING.start = { total: FILES.get.size };

		// testing overrides
		// SETTINGS.set = { outputZip: true, output: '/' };
		// SETTINGS.set = { output: 'test' };
		// SETTINGS.set = {
		// 	outputCss: 'test/css',
		// 	outputJs: 'test/js',
		// 	outputHtml: 'test/html',
		// 	outputToken: 'test/tokens',
		// };

		D.log(`Settings: ${JSON.stringify(SETTINGS.get)}`);

		const result = {
			code: 0,
			errors: [],
		};

		// handle zip files
		if (SETTINGS.get.outputZip) {
			D.log(`Generating zip file`);

			// create an archiver instance we can add to if we're zipping the files
			const output = SETTINGS.get.output ? fs.createWriteStream(__dirname + '/output.zip') : null;
			const archive = archiver('zip');

			// listen for archive data to be written to disk
			if (output) {
				output.on('close', (err) => {
					if (err) {
						result.errors.push(`Error archiving files: ${err}`);
						return reject(result);
					}
					D.log(`Zip file written`);
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
				return reject(result);
			});

			// catch errors
			archive.on('error', (err) => {
				result.code = 1;
				result.errors.push(`Error archiving files: ${err}`);
				return reject(result);
			});

			FILES.get.forEach(async ({ name, path, content }) => {
				// append each file to the zip
				archive.append(content, { name: `${path}/${name}` }, 'utf-8');

				await sleep(2000 * Math.random());
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
				return resolve(archive);
			}

		} else if (
			SETTINGS.get.output ||
			SETTINGS.get.outputCss ||
			SETTINGS.get.outputJs ||
			SETTINGS.get.outputHtml ||
			SETTINGS.get.outputToken
		) {

			D.log(`Saving files`);

			FILES.get.forEach(async ({ name, path, content, category }) => {

				// save all files to a directory
				if (SETTINGS.get.output) {
					writeFile(name, SETTINGS.get.output, content);
				}
				// save styles
				else if (SETTINGS.get.outputCss && category === 'css') {
					writeFile(name, SETTINGS.get.outputCss, content);
				}
				// save javascript
				else if (SETTINGS.get.outputJs && category === 'js') {
					writeFile(name, SETTINGS.get.outputJs, content);
				}
				// save html
				else if (SETTINGS.get.outputHtml && category === 'html') {
					writeFile(name, SETTINGS.get.outputHtml, content);
				}
				// save tokens
				else if (SETTINGS.get.outputToken && category === 'token') {
					writeFile(name, SETTINGS.get.outputToken, content);
				}

				await sleep(2000 * Math.random());
				LOADING.tick();
			});

			LOADING.abort();
			return resolve(result);

		} else {

			D.log(`Returning files directly`);
			LOADING.abort();
			return resolve([...FILES.get]);

		}

		LOADING.abort();

	});
}

function writeFile(name, path, content) {
	return new Promise(async (resolve, reject) => {

		// create directory if it doesn't already exist
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true }, (err) => {
				if (err) {
					result.code = 1;
					result.errors.push(`Error creating directory: ${err}`);
					return reject(result);
				}
				return resolve(result);
			});
		}

		// write file to specified path with content
		fs.writeFileSync(`${path}/${name}`, content, (err) => {
			if (err) {
				result.code = 1;
				result.errors.push(`Error outputting file: ${err}`);
				return reject(result);
			}
			return resolve(result);
		});

	});
}

return saveFiles();

module.exports = exports = {
	saveFiles,
	writeFile,
};
