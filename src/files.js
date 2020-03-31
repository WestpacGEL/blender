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

	set add({ name, path, content }) {
		this.store.set(`${path}/${name}`, {
			name,
			path,
			content,
		});
	},

	clean() {
		this.store.clear();
	},
};

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

FILES.add = { name: 'thing1.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing2.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing3.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing4.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing5.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing6.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing7.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing8.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing9.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing10.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing11.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing12.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing13.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing14.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing15.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing16.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing17.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing18.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing19.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing20.js', path: 'path/to', content: "alert('Hello World');" };
FILES.add = { name: 'thing21.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing22.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing23.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing24.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing25.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing26.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing27.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing28.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing29.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing30.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing31.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing32.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing33.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing34.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing35.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing36.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing37.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing38.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing39.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = { name: 'thing40.css', path: 'path/to', content: 'body { background red; }' };
FILES.add = {
	name: 'thing41.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing42.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing43.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing44.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing45.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing46.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing47.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing48.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing49.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing50.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing51.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing52.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing53.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing54.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing55.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing56.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing57.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing58.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing59.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};
FILES.add = {
	name: 'thing60.html',
	path: 'path/to',
	content: '<html><title /><body>Hello World</body></html>',
};

async function saveFiles() {
	D.header('saveFiles');

	// TODO: Add loader here, know how many files there are, start loader with this many
	// see how fast it is, if non progress with 50, change minFiles to a different number

	DEBUG.enabled = true; // SETTINGS.get.debug;

	// testing overrides
	// SETTINGS.set = { outputZip: true };
	// SETTINGS.set = { output: 'test' };
	SETTINGS.set = {
		outputCss: 'test/css',
		outputJs: 'test/js',
		outputHtml: 'test/html',
	};

	D.log(`Settings: ${JSON.stringify(SETTINGS.get)}`);

	const result = {
		code: 0,
		errors: [],
	};

	// handle zip files
	/*
		output: 'path/to/all' // this writes it to disk, otherwise just returns it, CLI report didn't give it a place so it's gone now
		outputZip: true
	*/
	if (SETTINGS.get.outputZip) {
		D.log(`Generating zip file`);

		LOADING.start = { total: FILES.get.size };

		// create an archiver instance we can add to if we're zipping the files
		const output = SETTINGS.get.output ? fs.createWriteStream(__dirname + '/output.zip') : null;
		const archive = archiver('zip');

		// listen for archive data to be written to disk
		if (output) {
			output.on('close', () => {
				D.log(`Zip file written as ${color.yellow(archive.pointer())} total bytes`);
			});
		}

		// catch warnings
		archive.on('warning', (err) => {
			result.code = 1;
			if (err.code === 'ENOENT') {
				result.errors.push(`Could not find file or directory`);
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

		LOADING.abort();

		// if we aren't outputing it anywhere, just return the zip directly
		if (!output) {
			return archive;
		}
	} else if (
		SETTINGS.get.output ||
		SETTINGS.get.outputCss ||
		SETTINGS.get.outputJs ||
		SETTINGS.get.outputHtml ||
		SETTINGS.get.outputToken
	) {
		D.log(`Saving files`);

		LOADING.start = { total: FILES.get.size };

		const writeFile = (name, path, content) => {
			// create directory if it doesn't already exist
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path, { recursive: true });
			}
			// write file to specified path with content
			fs.writeFileSync(`${path}/${name}`, content, (err) => {
				if (err) {
					result.code = 1;
					result.errors.push(`Error outputting file: ${err}`);
				}
			});
		};

		FILES.get.forEach(async({ name, path, content }) => {
			// save all files to a directory
			if (SETTINGS.get.output) {
				writeFile(name, SETTINGS.get.output, content);
				return;
			}

			// save styles
			if (SETTINGS.get.outputCss && /css|less|sass/.test(name)) {
				writeFile(name, SETTINGS.get.outputCss, content);
			}

			// save javascript
			if (SETTINGS.get.outputJs && name.includes('js')) {
				writeFile(name, SETTINGS.get.outputJs, content);
			}

			// save html
			if (SETTINGS.get.outputHtml && name.includes('html')) {
				writeFile(name, SETTINGS.get.outputHtml, content);
			}

			// if (SETTINGS.get.outputTokens) {
			// 	// tokens-format, default as json but can be 'json', 'less', 'sass'
			// 	writeFile(name, SETTINGS.get.outputHtml, content);
			// }

			await sleep(1000);

			LOADING.tick();
		});

		// LOADING.abort();

		return result;
	} else {
		D.log(`Returning files`);

		return [...FILES.get];
	}
}

return saveFiles();
