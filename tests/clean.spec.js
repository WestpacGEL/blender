/**
 * Testing src/clean.js functions
 *
 * PACKAGES
 * getPackages
 **/
const path = require('path');

const { DEBUG, DEBUGdefaults } = require('../src/debug.js');
const { PACKAGES } = require('../src/packages.js');
const { SETTINGS } = require('../src/settings.js');
const { LOADING } = require('../src/loading.js');
const { clean } = require('../src/clean.js');
const { BRAND } = require('../src/brand.js');
const { FILES } = require('../src/files.js');
const { TIME } = require('../src/time.js');

/**
 * CLEAN
 */
describe('clean', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('clean all stores', () => {
		console.log = jest.fn();

		DEBUG.mode = 'stuff';
		DEBUG.enabled = 'stuff';
		DEBUG.addError();
		DEBUG.messages = 'stuff';
		DEBUG.messages = 'stuff2';
		DEBUG.messages = 'stuf3';
		DEBUG.buffer = 'stuf1';
		DEBUG.buffer = 'stuf2';
		DEBUG.buffer = 'stuf3';
		PACKAGES.set = 'stuff';
		SETTINGS.set = 'stuff';
		LOADING.start = { total: 5, other: 'stuff', end: true };
		BRAND.set = 'stuff';
		FILES.add = { name: 'stuff', filePath: 'path stuff', dir: 'dir stuff', other: 'stuff' };
		FILES.add = { name: 'stuff2', filePath: 'path stuff2', dir: 'dir stuff2', other: 'stuff2' };
		FILES.add = { name: 'stuff3', filePath: 'path stuff3', dir: 'dir stuff3', other: 'stuff3' };
		TIME.store.time.push('stuff');

		clean();

		expect(DEBUG.store).toStrictEqual(DEBUGdefaults);
		expect(PACKAGES.get).toStrictEqual([]);
		expect(SETTINGS.get).toStrictEqual({});
		expect(LOADING.store).toStrictEqual({});
		expect(BRAND.get).toStrictEqual({});
		expect(FILES.get).toStrictEqual(new Map());
		expect(TIME.store.time).toStrictEqual([]);
	});
});
