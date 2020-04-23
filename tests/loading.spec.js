/**
 * Testing src/loading.js functions
 *
 * LOADING
 **/
const { inspect } = require('util');

const { LOADING } = require('../src/loading.js');

const sleep = (wait) => new Promise((resolve) => setTimeout(resolve, wait));

/**
 * LOADING
 */
describe('LOADING', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test.only('Displays the spinner for the first 2s', async () => {
		const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());

		LOADING.start = {
			total: 5,
		};

		LOADING.tick();
		LOADING.tick();

		await sleep(1500);

		LOADING.abort();

		expect(mockStdout.mock.calls[1][0].includes('⠋')).toBe(true);
		expect(mockStdout).toHaveBeenCalled();
		mockStdout.mockRestore();
	});

	test.only('Displays the block progress after 2s', async () => {
		const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());

		LOADING.start = {
			total: 5,
		};

		LOADING.tick();
		LOADING.tick();
		LOADING.tick();

		await sleep(2500);

		LOADING.abort();

		expect(mockStdout.mock.calls[mockStdout.mock.calls.length - 2][0].includes('▓')).toBe(true);
		expect(mockStdout).toHaveBeenCalled();
		mockStdout.mockRestore();
	});

	test.only('Cleans up after everything is done', async () => {
		const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());

		LOADING.start = {
			total: 3,
		};

		LOADING.tick();
		LOADING.tick();
		LOADING.tick();

		await sleep(2500);

		expect(mockStdout.mock.calls[0][0]).toBe('\u001b[2K\u001b[1G');
		expect(mockStdout).toHaveBeenCalledTimes(1);
		mockStdout.mockRestore();
	});

	test.only('Use configurable display bits', async () => {
		const mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => jest.fn());
		jest.doMock('window-size', () => ({ width: 200 }));
		const WinSize = require('window-size');

		const { LOADING } = require('../src/loading.js');

		LOADING.start = {
			total: 3,
			spinner: ['1', '2', '3'],
			done: '=',
			todo: '-',
			left: '[',
			right: ']',
		};

		await sleep(2500); // no ticks before time runs out to progress bar
		LOADING.tick();
		LOADING.tick();
		LOADING.tick();
		LOADING.tick(); // one more tick than necessary

		expect(inspect(mockStdout.mock.calls[1][0].trim())).toBe(inspect('1\u001b[1G'));
		expect(inspect(mockStdout.mock.calls[3][0].trim())).toBe(inspect('2\u001b[1G'));
		expect(inspect(mockStdout.mock.calls[5][0].trim())).toBe(inspect('3\u001b[1G'));
		expect(inspect(mockStdout.mock.calls[7][0].trim())).toBe(inspect('1\u001b[1G'));
		expect(mockStdout.mock.calls[mockStdout.mock.calls.length - 2][0].includes('[')).toBe(true);
		expect(mockStdout.mock.calls[mockStdout.mock.calls.length - 2][0].includes(']')).toBe(true);
		expect(mockStdout.mock.calls[mockStdout.mock.calls.length - 2][0].includes('=')).toBe(true);
		expect(mockStdout.mock.calls[mockStdout.mock.calls.length - 2][0].includes('-')).toBe(true);
		expect(mockStdout).toHaveBeenCalled();
		mockStdout.mockRestore();
	});
});
