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
	set set({ path, content }) {
		this.store.set(path, content);
	},
	clean() {
		this.store.clear();
	},
};

FILES.set = { path: 'path/to/thing.js', content: 'ASDJSADHSAIDHASJDHKASE' };
FILES.set = { path: 'path/to/thing2.js', content: 'ASDJSADHSAIDHASJDHKASE' }
FILES.set = { path: 'path/to/thin3.js', content: 'ASDJSADHSAIDHASJDHKASE' }
FILES.set = { path: 'path/to/thing.js', content: 'ASDJSADHSAIDHASJDHKASE' }

function saveFiles() {
	FILES.get.forEach((content, filePath) => {
		if(SETTINGS.get.zip) {
			// save all files into zip
		}
		else if () {
			// save all files individually
		}
		else {
			return files;
		}
	});
}
