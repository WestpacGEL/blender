/**
 * All functions for the generator
 *
 * generator  - Generate files from our blender packages
 * stripScope - Strip the scope from a package name
 **/
const path = require('path');

const { generateTokenFile } = require('./generate-tokens.js');
const { generateCssHtml } = require('./generate-css-html.js');
const { generateDocsFile } = require('./generate-docs.js');
const { generateJSFile } = require('./generate-js.js');
const { version } = require('../package.json');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { FILES } = require('./files.js');
const { color } = require('./color.js');
const { D } = require('./log.js');

/**
 * Generate files from our blender packages
 *
 * @param  {array} packages - An array of all packages
 *
 * @return {object}         - Results object
 */
function generator(packages) {
	D.header('generator', { packages });
	const result = {
		code: 0,
		errors: [],
		messages: [],
	};

	let cssFile = ''; // this is where we collect all our css
	let jsFile = ''; // this is where we collect all our js
	let coreCSS = ''; // we need to keep a record of the core css so we can remove it from each component later
	const docs = []; // keeping track of all docs we add for building the index

	LOADING.start = { total: packages.length };

	// Building core
	packages
		.filter((pkg) => pkg.pkg.isCore)
		.map((core) => {
			D.log(`Blending package ${color.yellow(core.name)}`);

			// Building CSS
			if (SETTINGS.get.outputCss && core.pkg.recipe) {
				D.log(`Creating css for ${color.yellow(core.name)}`);
				const { css, oldCss, ...parsedPkg } = generateCssHtml({ pkg: core });

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				coreCSS += oldCss; // store css for later

				// save each file into its own module
				if (SETTINGS.get.modules) {
					let filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
					if (SETTINGS.get.outputZip) {
						filePath = 'blender/';
					}
					filePath = path.normalize(`${filePath}/css/`);
					const name = `${stripScope(core.name)}.css`;

					D.log(`Adding core css to store at path ${color.yellow(filePath + name)}`);
					FILES.add = {
						name,
						path: filePath,
						content: css,
					};
				}
				// we collect all css in the cssFile variable to be added to store at the end
				else {
					D.log(`Adding core css to variable for store`);
					cssFile += `${css}\n`;
				}
			}

			// Building HTML
			if (SETTINGS.get.outputHtml && core.pkg.recipe) {
				D.log(`Creating html file for ${color.yellow(core.name)}`);

				const { html, ...parsedPkg } = generateCssHtml({ pkg: core, componentName: 'Docs' });

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				let filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
				if (SETTINGS.get.outputZip) {
					filePath = 'blender/';
				}
				filePath = path.normalize(`${filePath}/docs/packages/`);
				const name = `${stripScope(core.name)}.html`;

				docs.push({
					name: core.name,
					path: filePath + name,
				});

				D.log(`Adding core html to store at path ${color.yellow(filePath + name)}`);
				FILES.add = {
					name,
					path: filePath,
					content: generateDocsFile(html),
				};
			}

			// Building JS
			if (SETTINGS.get.outputJs && core.pkg.js && !SETTINGS.get.excludeJquery) {
				D.log(`Creating js file for ${color.yellow(core.name)}`);

				const { js, ...parsedPkg } = generateJSFile(core);

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				// save each file into its own module
				if (SETTINGS.get.modules) {
					let filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
					if (SETTINGS.get.outputZip) {
						filePath = 'blender/';
					}
					filePath = path.normalize(`${filePath}/js/`);
					const name = `${stripScope(core.name)}.js`;

					D.log(`Adding core js to store at path ${color.yellow(filePath + name)}`);
					FILES.add = {
						name,
						path: filePath,
						content: js,
					};
				}
				// we collect all js in the cssFile variable to be added to store at the end
				else {
					D.log(`Adding core js to variable for store`);
					jsFile += `${js}\n`;
				}
			}

			LOADING.tick();
		});

	// Building rest of packages (drawing the rest of the f** owl)
	packages
		.filter((pkg) => !pkg.pkg.isCore)
		.map((thisPackage) => {
			D.log(`Blending package ${color.yellow(thisPackage.name)}`);

			// Building tokens
			if (SETTINGS.get.outputTokens && thisPackage.pkg.tokens) {
				const compiledTokens = generateTokenFile(thisPackage.path, SETTINGS.get.tokensFormat);

				let filePath = SETTINGS.get.outputTokens || SETTINGS.get.output;
				if (SETTINGS.get.outputZip) {
					filePath = 'blender/';
				}
				filePath = path.normalize(`${filePath}/tokens/`);
				const name = `tokens.${SETTINGS.get.tokensFormat}`;

				D.log(`Adding tokens to store at path ${color.yellow(filePath + name)}`);
				FILES.add = {
					name,
					path: filePath,
					content: compiledTokens,
				};
			}

			// Building CSS
			if (SETTINGS.get.outputCss && thisPackage.pkg.recipe) {
				D.log(`Creating css for ${color.yellow(thisPackage.name)}`);
				const { css, ...parsedPkg } = generateCssHtml({ pkg: thisPackage, coreCSS });

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				// save each file into its own module
				if (SETTINGS.get.modules) {
					let filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
					if (SETTINGS.get.outputZip) {
						filePath = 'blender/';
					}
					filePath = path.normalize(`${filePath}/css/`);
					const name = `${stripScope(thisPackage.name)}.css`;

					D.log(`Adding package css to store at path ${color.yellow(filePath + name)}`);
					FILES.add = {
						name,
						path: filePath,
						content: css,
					};
				}
				// we collect all css in the cssFile variable to be added to store at the end
				else {
					cssFile += `${css}\n`;
				}
			}

			// Building HTML
			if (SETTINGS.get.outputHtml && thisPackage.pkg.recipe) {
				D.log(`Creating html file for ${color.yellow(thisPackage.name)}`);

				const { html, ...parsedPkg } = generateCssHtml({ pkg: thisPackage, componentName: 'Docs' });

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				let filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
				if (SETTINGS.get.outputZip) {
					filePath = 'blender/';
				}
				filePath = path.normalize(`${filePath}/docs/packages/`);
				const name = `${stripScope(thisPackage.name)}.html`;

				docs.push({
					name: thisPackage.name,
					path: filePath + name,
				});

				D.log(`Adding package html to store at path ${color.yellow(filePath + name)}`);
				FILES.add = {
					name,
					path: filePath,
					content: generateDocsFile(html),
				};
			}

			// Building JS
			if (SETTINGS.get.outputJs && thisPackage.pkg.js) {
				D.log(`Creating js for ${color.yellow(thisPackage.name)}`);
				const { js, ...parsedPkg } = generateJSFile(thisPackage);

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
					result.messages = [...result.messages, ...parsedPkg.messages];
				}

				// save each file into its own module
				if (SETTINGS.get.modules) {
					let filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
					if (SETTINGS.get.outputZip) {
						filePath = 'blender/';
					}
					filePath = path.normalize(`${filePath}/js/`);
					const name = `${stripScope(thisPackage.name)}.js`;

					D.log(`Adding package js to store at path ${color.yellow(filePath + name)}`);
					FILES.add = {
						name,
						path: filePath,
						content: js,
					};
				}
				// we collect all js in the jsFile variable to be added to store at the end
				else {
					jsFile += `${js}\n`;
				}
			}

			LOADING.tick();
		});

	// Add the css we collected from all packages
	if (!SETTINGS.get.modules) {
		let filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/css/`);
		const name = `styles.min.css`; // TODO minify on/off

		D.log(`Adding css to store at path ${color.yellow(filePath + name)}`);
		FILES.add = {
			name,
			path: filePath,
			content: cssFile,
		};
	}

	// Add the js we collected from all packages
	if (!SETTINGS.get.modules) {
		let filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/js/`);
		const name = `script.min.js`; // TODO minify on/off

		D.log(`Adding js to store at path ${color.yellow(filePath + name)}`);
		FILES.add = {
			name,
			path: filePath,
			content: jsFile,
		};
	}

	//*********************************************************************
	// TODO: build docs/index.html from `docs` array
	//*********************************************************************
	// const index = generateIndexFile(docs);
	// write index to file

	LOADING.abort();

	D.log(`generator return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

/**
 * Strip the scope from a package name
 *
 * @param  {string} name - The name of the package
 *
 * @return {string}      - Name without scope
 */
function stripScope(name) {
	const bits = name.split('/');

	if (bits.length > 1) {
		return name.split('/').slice(1).join('/');
	} else {
		return name;
	}
}

module.exports = exports = {
	generator,
	stripScope,
};
