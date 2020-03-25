const { color } = require('./color.js');

const CLIOPTIONS = {
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
		type: ['string', 'object'],
		default: {},
	},
	'output-css': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender --output-css path/to/css',
		type: 'string',
	},
	'output-js': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender --output-css path/to/js',
		type: 'string',
	},
	'output-html': {
		description: 'Specify where the blender should save the css files to',
		example: 'blender --output-css path/to/html',
		type: 'string',
	},
	'output-token': {
		description: 'Specify where the blender should save the token file to',
		example: 'blender --output-token path/to/token',
		type: 'string',
	},
	'output-zip': {
		description: 'Tell blender to zip up all files into an archive',
		example: 'blender --output path/to/folder --output-zip',
		type: false,
	},
	scope: {
		description: 'Specify what npm scope the blender should look through',
		example: 'blender -s "@westpac"',
		flag: 's',
		type: 'string',
		default: '@westpac',
	},
	include: {
		description: 'White-list specific components you want to blend',
		example: 'blender -i "@westpac/body" "@westpac/button"',
		flag: 'i',
		type: 'string',
	},
	exclude: {
		description: `Black-list specific components you don't want to blend`,
		example: 'blender -x "@westpac/tabcordion" "@westpac/grid"',
		flag: 'x',
		type: 'string',
	},
	prettify: {
		description: 'Specify if you want you code to be prettified',
		example: 'blender -p',
		flag: 'p',
		type: 'boolean',
		default: false,
	},
	'include-jquery': {
		description: 'Specify if you want to include jQuery in your blend',
		example: 'blender -j',
		flag: 'j',
		type: 'boolean',
		default: true,
	},
	modules: {
		description: 'Specify if you want each component to be output separately',
		example: 'blender -m',
		flag: 'm',
		type: 'boolean',
		default: false,
	},
	'version-in-class': {
		description: 'Specify if you want the component version included in the css classes',
		example: 'blender -c',
		flag: 'c',
		type: 'boolean',
		default: true,
	},
	'tokens-format': {
		description: 'Specify what format the tokens should be in',
		example: 'blender -t json',
		flag: 't',
		type: 'string',
		arguments: ['json', 'less', 'sass'],
		default: 'json',
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
		example: 'blender -h',
		flag: 'h',
		type: 'boolean',
		default: false,
	},
};

module.exports = exports = {
	CLIOPTIONS,
};
