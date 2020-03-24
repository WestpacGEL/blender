const { parseComponent } = require('../lib/parseComponent.js');
const path = require('path');

describe('parseComponent', () => {
	test('parse component correctly', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			brand: {},
		});

		expect(result.status).toBe('ok');
		expect(result.ids.length).toBe(5);
	});
});
