/**
 * All constance shared with all functions
 *
 * CLIOPTIONS - Default settings for our cli flags
 **/
const { color } = require('./color.js');

/**
 * Default settings for our cli flags
 *
 * @type {Object}
 */
const CLIOPTIONS = {
	test: {
		description: 'Run the blender in test mode',
		example: 'blender -T',
		flag: 'T',
		type: 'boolean',
		default: false,
	},
	brand: {
		description: 'Specify the brand you want to blend',
		example: 'blender -b WBC',
		flag: 'b',
		type: 'string',
		arguments: ['WBC', 'WBG', 'BOM', 'BSA', 'STG', 'BTFG'],
	},
	output: {
		description: 'Specify where the blender should save all your files to',
		example: 'blender -o path/to/folder',
		flag: 'o',
		type: 'string',
	},
	'output-css': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender -c path/to/css',
		flag: 'c',
		type: 'string',
	},
	'output-js': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender -j path/to/js',
		flag: 'j',
		type: 'string',
	},
	'output-html': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender -h path/to/html',
		flag: 'h',
		type: 'string',
	},
	'output-tokens': {
		description: 'Specify where the blender should save the tokens file to',
		example: 'blender -t path/to/tokens',
		flag: 't',
		type: 'string',
	},
	'output-zip': {
		description: 'Tell blender to zip up all files into an archive',
		example: 'blender --output path/to/folder -z',
		flag: 'z',
		type: 'boolean',
	},
	scope: {
		description: 'Specify what npm scope the blender should look through',
		example: 'blender -S "@westpac"',
		flag: 'S',
		type: 'string',
		default: '@westpac',
	},
	include: {
		description: 'White-list specific packages you want to blend',
		example: 'blender -i "@westpac/body" "@westpac/button"',
		flag: 'i',
		type: 'array',
		default: [],
	},
	exclude: {
		description: `Black-list specific packages you don't want to blend`,
		example: 'blender -x "@westpac/tabcordion" "@westpac/grid"',
		flag: 'x',
		type: 'array',
		default: [],
	},
	prettify: {
		description: 'Specify if you want you code to be prettified',
		example: 'blender -p',
		flag: 'p',
		type: 'boolean',
		default: false,
	},
	'exclude-jquery': {
		description: `Specify if you don't want to include jQuery in your blend`,
		example: 'blender -J',
		flag: 'J',
		type: 'boolean',
		default: false,
	},
	modules: {
		description: 'Specify if you want each component to be output separately',
		example: 'blender -m',
		flag: 'm',
		type: 'boolean',
		default: false,
	},
	'no-version-in-class': {
		description: `Specify if you don't want the component version included in your css classes`,
		example: 'blender -C',
		flag: 'C',
		type: 'boolean',
		default: false,
	},
	'tokens-format': {
		description: 'Specify what format the tokens should be in',
		example: 'blender -f json',
		flag: 'f',
		type: 'string',
		arguments: ['JSON', 'LESS', 'SASS', 'SCSS', 'CSS'],
		default: 'json',
	},
	cwd: {
		description: 'Specify the current working directory',
		example: 'blender -D path/to/cwd',
		flag: 'D',
		type: 'string',
	},
	debug: {
		description: 'Tell the blender to go into debug mode',
		example: 'blender -d',
		flag: 'd',
		type: 'boolean',
		default: false,
	},
	version: {
		description: `Tell the blender to show it's version`,
		example: 'blender -v',
		flag: 'v',
		type: 'boolean',
		default: false,
	},
	help: {
		description: 'Tell the blender to show the help',
		example: 'blender -H',
		flag: 'H',
		type: 'boolean',
		default: false,
	},
};

module.exports = exports = {
	CLIOPTIONS,
};
