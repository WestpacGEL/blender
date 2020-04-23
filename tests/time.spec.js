/**
 * Testing src/time.js functions
 *
 * TIME
 * convertHrtime
 **/
const { TIME, convertHrtime } = require('../src/time.js');

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
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = TIME.stop();

		expect(TIME.store.time.length).toBe(0);
		expect(result.length).toBeGreaterThan(0);
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
		const timeInPast = [526372, 265833855];
		const result = convertHrtime(process.hrtime(timeInPast));
		console.log(1, process.hrtime(timeInPast));
		console.log(2, result);
		const parsedTime = parseFloat(result);
		console.log(3, parsedTime);

		expect(typeof parsedTime).toBe('number');
		expect(parsedTime).toBeGreaterThan(0);
	});
	test('Pass in string and get the same thing back', () => {
		const result = convertHrtime(5);

		expect(typeof result).toBe('number');
		expect(result).toBe(5);
	});
});
