/**
 * Testing src/time.js functions
 *
 * TIME
 * convertHrtime
 **/
const path = require('path');

const {
	TIME,
	convertHrtime,
} = require('../src/time.js');
const { SETTINGS } = require('../src/settings.js');

/**
 * TIME
 */
describe('TIME', () => {
	test('Start a timer', () => {
		TIME.clean();
		TIME.start();

		expect(TIME.store.time.length).toBe(2);
	});
	test('Stop a timer', async () => {
		TIME.clean();
		TIME.start();
		await new Promise(resolve => setTimeout(resolve, 10));
		const result = TIME.stop();

		expect(TIME.store.time.length).toBe(0);
		expect(result.length > 0).toBe(true);
		expect(result.includes('s')).toBe(true);
		expect(result).not.toBe('0.000s');
	});
	test('Check timer has stopped', async () => {
		TIME.clean();
		TIME.start();
		TIME.stop();
		const result = TIME.hasStopped();

		expect(result).toBe(true);
	});
	test('Clean a timer from cache', async () => {
		TIME.clean();
		TIME.start();
		TIME.stop();
		TIME.clean();
		expect(TIME.store.time.length).toBe(0);
	});
});

/**
 * convertHrtime
 */
describe('convertHrtime', () => {
	test('Convert hrtime array to elapsed time in seconds', () => {
		const timeInPast = [ 526372, 265833855 ];
		const result = convertHrtime(process.hrtime(timeInPast));
		const parsedTime = parseFloat(result);

		expect(typeof parsedTime).toBe('number');
		expect(parsedTime > 0).toBe(true);
	});
	test('Pass in string and get the same thing back', () => {
		const result = convertHrtime(5);

		expect(typeof result).toBe('number');
		expect(result).toBe(5);
	});
});
