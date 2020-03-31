/**
 * Testing src/const.js functions
 *
 * CLIOPTIONS
 **/
const { CLIOPTIONS } = require('../src/const.js');

/**
 * CLIOPTIONS
 */
describe('CLIOPTIONS', () => {
	test('There should be no duplicate flags', () => {
		const dict = [];

		Object.entries(CLIOPTIONS).map(([key, value]) => {
			expect(dict).toEqual(expect.not.arrayContaining([key]));
			dict.push(key);

			if (value.flag) {
				expect(dict).toEqual(expect.not.arrayContaining([value.flag]));
				dict.push(value.flag);
			}
		});
	});
});
