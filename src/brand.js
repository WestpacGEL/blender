/**
 * All functions for getting and keeping the brand package
 *
 * BRAND    - Brand store
 * setBrand - Get the brand package and save it into our store
 **/
const path = require('path');

const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Brand store
 *
 * @type {Object}
 */
const BRAND = {
	store: {},

	get get() {
		return this.store;
	},

	set set(brand) {
		this.store = brand;
	},

	clean() {
		this.store = {};
	},
};

/**
 * Get the brand package and save it into our store
 *
 * @param  {string} brand - The brand string which translates to it's name
 * @param  {string} cwd   - The current working directory
 *
 * @return {object}       - The brand object
 */
function setBrand(brand, cwd = process.cwd(), scope = SETTINGS.get.scope) {
	D.header('setBrand', { brand, cwd });

	const result = {
		code: 0,
		messages: [],
		pkg: {},
	};

	if (!brand || typeof brand !== 'string') {
		D.log(
			`Brand was not specified or not string: "${color.yellow(brand)}" of type ${color.yellow(
				typeof brand
			)}`
		);
		result.code = 1;
		result.messages.push(`You have to specify a brand`);
		return result;
	}

	const brandPath = path.normalize(
		`${cwd}/node_modules/${scope}/${brand.toLowerCase()}`
	);

	try {
		BRAND.set = require(brandPath).default;
		result.pkg = BRAND.get;
	} catch (error) {
		result.code = 1;
		result.messages.push(error);
		return result;
	}

	return result;
}

module.exports = exports = {
	BRAND,
	setBrand,
};
