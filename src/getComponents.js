/**
 * All functions for getting components from the node_modules folder
 *
 * getComponents - Handle exiting of program
 **/
const { SETTINGS } = require('./settings.js');

/**
 * Getting components from the node_modules folder
 *
 * @return {array} - An array of objects with component data
 */
function getComponents() {
	// run: blender -s "@w" -i x y z -x foo bar baz

	console.log(SETTINGS.get.scope);
	console.log(SETTINGS.get.include);
	console.log(SETTINGS.get.exclude);

	// read node_modules scope folder
	// filter out excludes
	// add includes (they may or may not be in the scope)
	// get that list of components and iterate over it
	// read it's package.json
	// return:
	// [
	// 	{
	// 		path: 'absolute/path/to/node_modules/scope/folder',
	// 		pkg: {} // the blender bit of the package.json of this component only
	// 	},
	// 	{
	// 		path: 'absolute/path/to/node_modules/scope/folder',
	// 		pkg: {} // the blender bit of the package.json of this component only
	// 	},
	// 	...
	// ]
}

module.exports = exports = {
	getComponents,
};
