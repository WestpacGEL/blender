/**
 * Testing src/debug.js functions
 *
 * DEBUG
 **/
const { DEBUG, DEBUGdefaults } = require('../src/debug.js');

/**
 * DEBUG
 */
describe('DEBUG', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Start with defaults', () => {
		expect(DEBUG.store).toStrictEqual(DEBUGdefaults);
		DEBUG.clean();
		expect(DEBUG.store).toStrictEqual(DEBUGdefaults);
		DEBUG.store = 'completely invalid';
		expect(DEBUG.store).toBe('completely invalid');
		DEBUG.clean();
		expect(DEBUG.store).toStrictEqual(DEBUGdefaults);
	});

	test('Set mode', () => {
		DEBUG.mode = 'mode';
		expect(DEBUG.mode).toBe('mode');
		DEBUG.mode = 'mode2';
		expect(DEBUG.mode).toBe('mode2');
	});

	test('Set enabled', () => {
		expect(DEBUG.set).toBe(false);
		DEBUG.enabled = true;
		expect(DEBUG.enabled).toBe(true);
		expect(DEBUG.set).toBe(true);
		DEBUG.enabled = false;
		expect(DEBUG.enabled).toBe(false);
	});

	test('Add an error', () => {
		expect(DEBUG.errorCount).toBe(0);
		DEBUG.addError();
		expect(DEBUG.errorCount).toBe(1);
		DEBUG.addError();
		DEBUG.addError();
		expect(DEBUG.errorCount).toBe(3);
	});

	test('Set messages', () => {
		expect(DEBUG.messages).toStrictEqual([]);
		DEBUG.messages = 'one';
		expect(DEBUG.messages.includes('one')).toBe(true);
		expect(DEBUG.messages.length).toBe(1);
		DEBUG.messages = 'two';
		expect(DEBUG.messages.includes('two')).toBe(true);
		expect(DEBUG.messages.length).toBe(2);
	});

	test('Set buffer', () => {
		expect(DEBUG.buffer).toStrictEqual([]);
		DEBUG.buffer = '';
		expect(DEBUG.buffer).toStrictEqual([]);
		DEBUG.buffer = 'one';
		expect(DEBUG.buffer.includes('one')).toBe(true);
		expect(DEBUG.buffer.length).toBe(1);
		DEBUG.buffer = 'two';
		expect(DEBUG.buffer.includes('two')).toBe(true);
		expect(DEBUG.buffer.length).toBe(2);
	});
});
