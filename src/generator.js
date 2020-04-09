/**
 * All functions for the generator
 *
 * generator  - Generate files from our blender packages
 * stripScope - Strip the scope from a package name
 **/
const beautify = require('js-beautify');
const path = require('path');

const { generateIndexFile, generateDocsAssets } = require('./generate-docs.js');
const { generateCss, generateHtml } = require('./generate-css-html.js');
const { generateTokenFile } = require('./generate-tokens.js');
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
	let coreHTML = ''; // we need to keep a record of the core html so we can remove it from each component later
	const docs = []; // keeping track of all docs we add for building the index

	LOADING.start = { total: packages.length };

	let cssMinFilePath = SETTINGS.get.outputCss || SETTINGS.get.output;
	if (SETTINGS.get.outputZip) {
		cssMinFilePath = 'blender/';
	}
	cssMinFilePath = path.normalize(`${cssMinFilePath}/css/`);
	const cssMinName = `styles${SETTINGS.get.prettify ? '' : '.min'}.css`;

	// Building core
	packages
		.filter((pkg) => pkg.pkg.isCore)
		.map((core) => {
			D.log(`Blending package ${color.yellow(core.name)}`);

			// keeping track of the css path
			let filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
			if (SETTINGS.get.outputZip) {
				filePath = 'blender/';
			}
			filePath = path.normalize(`${filePath}/css/`);
			const name = `${stripScope(core.name)}.css`;
			const cssFilePath = SETTINGS.get.modules ? filePath : cssMinFilePath;
			const cssName = SETTINGS.get.modules ? name : cssMinName;

			// Building CSS
			if (SETTINGS.get.outputCss && core.pkg.recipe) {
				D.log(`Creating css for ${color.yellow(core.name)}`);
				const { css, oldCss, oldHtml, ...parsedPkg } = generateCss({
					pkg: core,
					children: 'CORE',
				});

				coreHTML = oldHtml;

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
				}
				result.messages = [...result.messages, ...parsedPkg.messages];

				coreCSS += oldCss; // store css for later

				// save each file into its own module
				if (SETTINGS.get.modules) {
					D.log(`Adding core css to store at path ${color.yellow(cssFilePath + cssName)}`);
					FILES.add = {
						name: cssName,
						path: cssFilePath,
						content: formatCode(css, 'css'),
					};
				}
				// we collect all css in the cssFile variable to be added to store at the end
				D.log(`Adding core css to variable for store`);
				cssFile += `${css}\n`;
			}

			// Building HTML
			if (SETTINGS.get.outputHtml && core.pkg.recipe) {
				D.log(`Creating html file for ${color.yellow(core.name)}`);

				let filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
				if (SETTINGS.get.outputZip) {
					filePath = 'blender/';
				}
				const docsPath = `/docs/packages/`;
				filePath = path.normalize(filePath + docsPath);
				const name = `${stripScope(core.name)}.html`;

				const { html, ...parsedPkg } = generateHtml({
					pkg: core,
				});

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
				}
				result.messages = [...result.messages, ...parsedPkg.messages];

				docs.push({
					name: core.name,
					path: docsPath + name,
				});

				D.log(`Adding core html to store at path ${color.yellow(filePath + name)}`);
				FILES.add = {
					name,
					path: filePath,
					content: html,
				};
			}

			// Building JS
			if (SETTINGS.get.outputJs && core.pkg.js && !SETTINGS.get.excludeJquery) {
				D.log(`Creating js file for ${color.yellow(core.name)}`);

				const { js, ...rest } = generateJSFile(core);

				if (rest.code > 0) {
					result.code = 1;
					result.messages = [...result.messages, ...rest.message];
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
						content: formatCode(js, 'js'),
					};
				}
				// we collect all js in the jsFile variable to be added to store at the end
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

			// keeping track of the css path
			let filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
			if (SETTINGS.get.outputZip) {
				filePath = 'blender/';
			}
			filePath = path.normalize(`${filePath}/css/`);
			const name = `${stripScope(thisPackage.name)}.css`;
			const cssFilePath = SETTINGS.get.modules ? filePath : cssMinFilePath;
			const cssName = SETTINGS.get.modules ? name : cssMinName;

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
				const { css, ...parsedPkg } = generateCss({ pkg: thisPackage, coreCSS });

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
				}
				result.messages = [...result.messages, ...parsedPkg.messages];

				// save each file into its own module
				if (SETTINGS.get.modules) {
					D.log(`Adding package css to store at path ${color.yellow(cssFilePath + cssName)}`);
					FILES.add = {
						name: cssName,
						path: cssFilePath,
						content: formatCode(css, 'css'),
					};
				}
				// we collect all css in the cssFile variable to be added to store at the end
				cssFile += `${css}\n`;
			}

			// Building HTML
			if (SETTINGS.get.outputHtml && thisPackage.pkg.recipe) {
				D.log(`Creating html file for ${color.yellow(thisPackage.name)}`);

				let filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
				if (SETTINGS.get.outputZip) {
					filePath = 'blender/';
				}
				const docsPath = `/docs/packages/`;
				filePath = path.normalize(filePath + docsPath);
				const name = `${stripScope(thisPackage.name)}.html`;

				const { html, ...parsedPkg } = generateHtml({
					pkg: thisPackage,
					coreHTML,
				});

				if (parsedPkg.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...parsedPkg.errors];
				}
				result.messages = [...result.messages, ...parsedPkg.messages];

				docs.push({
					name: thisPackage.name,
					path: docsPath + name,
				});

				D.log(`Adding package html to store at path ${color.yellow(filePath + name)}`);
				FILES.add = {
					name,
					path: filePath,
					content: html,
				};
			}

			// Building JS
			if (SETTINGS.get.outputJs && thisPackage.pkg.js) {
				D.log(`Creating js for ${color.yellow(thisPackage.name)}`);
				const { js, ...rest } = generateJSFile(thisPackage);

				if (rest.code > 0) {
					result.code = 1;
					result.messages = [...result.messages, ...rest.message];
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
						content: formatCode(js, 'js'),
					};
				}
				// we collect all js in the jsFile variable to be added to store at the end
				else {
					jsFile += `${js}\n`;
				}
			}

			LOADING.tick();
		});

	if (!SETTINGS.get.modules) {
		// Add the css we collected from all packages
		D.log(`Adding css to store at path ${color.yellow(cssMinFilePath + cssMinName)}`);
		FILES.add = {
			name: cssMinName,
			path: cssMinFilePath,
			content: formatCode(cssFile, 'css'),
		};

		// Add the js we collected from all packages
		let filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/js/`);
		const name = `script${SETTINGS.get.prettify ? '' : '.min'}.js`;

		D.log(`Adding js to store at path ${color.yellow(filePath + name)}`);
		FILES.add = {
			name,
			path: filePath,
			content: formatCode(jsFile, 'js'),
		};
	}

	// Add the index docs file
	if (SETTINGS.get.outputHtml && docs.length) {
		const index = generateIndexFile(docs);

		let filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/docs/`);
		const name = `index.html`;

		// adding index file
		FILES.add = {
			name: 'index.html',
			path: filePath,
			content: index,
		};

		// adding css file to docs
		FILES.add = {
			name: 'styles.min.css',
			path: path.normalize(`${filePath}/assets/`),
			content: cssFile,
		};

		// adding each docs assets file
		generateDocsAssets().map((file) => {
			FILES.add = {
				name: file.name,
				path: path.normalize(`${filePath}/${file.path}`),
				content: file.content,
			};
		});
	}

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

function formatCode(code, lang, prettify = SETTINGS.get.prettify) {
	if (!prettify || (lang !== 'css' && lang !== 'js')) {
		return code;
	}

	return beautify[lang](code, {
		indent_with_tabs: true,
		end_with_newline: false,
		jslint_happy: true,
	});
}

module.exports = exports = {
	generator,
	stripScope,
};
