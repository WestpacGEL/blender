/**
 * All functions for the generator
 *
 * generator  - Generate files from our blender packages
 * blendPkg   - Generate CSS, Js, tokens and HTML from a package
 * stripScope - Strip the scope from a package name
 * formatCode - Prettifying js or css
 **/
const beautify = require('js-beautify');

const { generateIndexFile, generateDocsAssets } = require('./generate-docs.js');
const { generateCss, generateHtml } = require('./generate-css-html.js');
const { generateTokenFile } = require('./generate-tokens.js');
const { generateJSFile } = require('./generate-js.js');
const { SETTINGS } = require('./settings.js');
const { LOADING } = require('./loading.js');
const { COMMENT } = require('./config.js');
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
	let coreCss = ''; // we need to keep a record of the core css so we can remove it from each component later
	let coreHtml = ''; // we need to keep a record of the core html so we can remove it from each component later
	const docs = []; // keeping track of all docs we add for building the index

	LOADING.start = { total: packages.length };

	return new Promise(async (resolve) => {
		// Building core first so we can remove it from other packages
		const allCore = packages
			.filter((pkg) => pkg.pkg.isCore)
			.map(async (core) => {
				const { oldCss, oldHtml, js, css, html, ...rest } = await blendPkg({
					thisPkg: core,
					includeJs: !!SETTINGS.get.outputJs && !!SETTINGS.get.includeJquery,
					children: 'CORE',
				});

				if (rest.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...rest.errors];
				}
				result.messages = [...result.messages, ...rest.messages];

				// we keep track of the core css and html so we can remove it from other packages
				coreCss += oldCss;
				coreHtml += oldHtml;

				// we collect all css and js for a possible concatenated css/js file
				cssFile += css;
				jsFile += js;
				if (html) {
					docs.push(html);
				}

				LOADING.tick();
			});

		// need to wait for all cores to be finished before we can deal with the rest
		await Promise.all(allCore);

		// Building rest of packages (drawing the rest of the f** owl)
		const allPkgs = packages
			.filter((pkg) => !pkg.pkg.isCore)
			.map(async (thisPkg) => {
				const { css, js, html, ...rest } = await blendPkg({
					thisPkg,
					coreCss,
					coreHtml,
				});

				if (rest.code > 0) {
					result.code = 1;
					result.errors = [...result.errors, ...rest.errors];
				}
				result.messages = [...result.messages, ...rest.messages];

				// we collect all css and js for a possible concatenated css/js file
				cssFile += css;
				jsFile += js;
				if (html) {
					docs.push(html);
				}

				LOADING.tick();
			});

		await Promise.all(allPkgs);

		if (!SETTINGS.get.modules) {
			// Add the css we collected from all packages
			if (SETTINGS.get.outputCss && cssFile) {
				D.log(`Adding main css to store`);
				FILES.add = {
					name: `styles${SETTINGS.get.prettify ? '' : '.min'}.css`,
					dir: SETTINGS.get.outputCss,
					content: `${COMMENT.join('\n')}\n${formatCode(cssFile, 'css')}`,
				};
			}

			// Add the js we collected from all packages
			if (SETTINGS.get.outputJs && jsFile) {
				D.log(`Adding main js to store`);
				FILES.add = {
					name: `script${SETTINGS.get.prettify ? '' : '.min'}.js`,
					dir: SETTINGS.get.outputJs,
					content: `${COMMENT.join('\n')}\n${formatCode(jsFile, 'js')}`,
				};
			}
		}

		// Add the index docs file
		if (SETTINGS.get.outputDocs && docs.length) {
			const index = generateIndexFile(docs);

			// adding index file
			D.log(`Adding ${color.yellow('docs/index.html')} to store`);
			FILES.add = {
				name: 'index.html',
				dir: SETTINGS.get.outputDocs,
				content: index,
			};

			if (cssFile) {
				// adding css file to docs
				D.log(`Adding ${color.yellow('docs/styles.min.css')} to store`);
				FILES.add = {
					name: 'styles.min.css',
					filePath: 'assets/',
					dir: SETTINGS.get.outputDocs,
					content: `${COMMENT.join('\n')}\n${cssFile}`,
				};
			}

			if (jsFile) {
				// adding js file to docs
				D.log(`Adding ${color.yellow('docs/script.min.js')} to store`);
				FILES.add = {
					name: 'script.min.js',
					filePath: 'assets/',
					dir: SETTINGS.get.outputDocs,
					content: `${COMMENT.join('\n')}\n${jsFile}`,
				};
			}

			// adding each docs assets file
			generateDocsAssets().map((file) => {
				D.log(`Adding ${color.yellow(file.name)} to store`);
				FILES.add = file;
			});
		}

		LOADING.abort();

		D.log(`generator return: "${color.yellow(JSON.stringify(result))}"`);

		return resolve({
			...result,
			files: [...FILES.get],
		});
	});
}

/**
 * Generate CSS, Js, tokens and HTML from a package
 *
 * @param  {object}  options.thisPkg       - The package object
 * @param  {string}  options.coreCss       - The core css string for removal
 * @param  {string}  options.coreHtml      - The core html string for removal
 * @param  {boolean} options.includeTokens - Switch to include tokens
 * @param  {boolean} options.includeCss    - Switch to include CSS
 * @param  {boolean} options.includeJs     - Switch to include Js
 * @param  {boolean} options.includeHtml   - Switch to include HTML
 *
 * @return {object}                        - A return object with css key
 */
async function blendPkg({
	thisPkg,
	coreCss = '',
	coreHtml = '',
	includeTokens = !!SETTINGS.get.outputTokens,
	includeCss = !!SETTINGS.get.outputCss,
	includeJs = !!SETTINGS.get.outputJs,
	includeHtml = !!SETTINGS.get.outputDocs,
	children,
}) {
	D.log(`Blending package ${color.yellow(thisPkg.name)}`);

	const result = {
		code: 0,
		errors: [],
		messages: [],
		oldCss: '',
		oldHtml: '',
		css: '',
		js: '',
		html: false,
	};

	// Building tokens
	if (includeTokens && thisPkg.pkg.tokens) {
		const brandRegex = new RegExp(`${SETTINGS.get.brand}`, 'i');
		if (brandRegex.test(thisPkg.name)) {
			D.log(`Creating tokens for ${color.yellow(thisPkg.name)}`);

			const compiledTokens = generateTokenFile(thisPkg.path, SETTINGS.get.tokensFormat);

			D.log(`Adding tokens to store`);
			FILES.add = {
				name: `tokens.${SETTINGS.get.tokensFormat}`,
				dir: SETTINGS.get.outputTokens,
				content: compiledTokens,
			};
		}
	}

	// Building CSS
	if (includeCss && thisPkg.pkg.recipe) {
		D.log(`Creating css for ${color.yellow(thisPkg.name)}`);
		const { css, oldCss, oldHtml, ...parsedPkg } = await generateCss({
			pkg: thisPkg,
			coreCss,
			children,
		});

		if (parsedPkg.code > 0) {
			result.code = 1;
			result.errors = [...result.errors, ...parsedPkg.errors];
		}
		result.messages = [...result.messages, ...parsedPkg.messages];

		// keeping track of unmodified css and html so we can remove it from the output later
		result.oldCss = oldCss;
		result.oldHtml = oldHtml;
		result.css = `${css}\n`;

		// save each file into its own module
		if (SETTINGS.get.modules) {
			D.log(`Adding ${color.yellow(thisPkg.name)} css to store`);
			FILES.add = {
				name: `${stripScope(thisPkg.name)}${SETTINGS.get.prettify ? '' : '.min'}.css`,
				dir: SETTINGS.get.outputCss,
				content: `${COMMENT.join('\n')}\n${formatCode(css, 'css')}`,
			};
		}
	}

	// Building HTML
	if (includeHtml && thisPkg.pkg.recipe) {
		D.log(`Creating html file for ${color.yellow(thisPkg.name)}`);

		const { html, ...parsedPkg } = await generateHtml({
			pkg: thisPkg,
			coreHtml,
		});

		if (parsedPkg.code > 0) {
			result.code = 1;
			result.errors = [...result.errors, ...parsedPkg.errors];
		}
		result.messages = [...result.messages, ...parsedPkg.messages];

		const name = `${stripScope(thisPkg.name)}.html`;

		result.html = {
			name: thisPkg.name,
			path: `packages/${name}`,
		};

		D.log(`Adding ${color.yellow(thisPkg.name)} html to store`);
		FILES.add = {
			name,
			filePath: `packages/`,
			dir: SETTINGS.get.outputDocs,
			content: html,
		};
	}

	// Building JS
	if (includeJs && thisPkg.pkg.js) {
		D.log(`Creating js for ${color.yellow(thisPkg.name)}`);
		const { js, ...rest } = generateJSFile(thisPkg);

		if (rest.code > 0) {
			result.code = 1;
			result.messages = [...result.messages, rest.message];
		}

		result.js = `${js}\n`;

		// save each file into its own module
		if (SETTINGS.get.modules) {
			D.log(`Adding ${color.yellow(thisPkg.name)} js to store`);
			FILES.add = {
				name: `${stripScope(thisPkg.name)}${SETTINGS.get.prettify ? '' : '.min'}.js`,
				dir: SETTINGS.get.outputJs,
				content: `${COMMENT.join('\n')}\n${formatCode(js, 'js')}`,
			};
		}
	}

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

/**
 * Prettifying js or css
 *
 * @param  {string}  code     - The code to be prettified
 * @param  {string}  lang     - The language
 * @param  {boolean} prettify - The switch to prettify or not
 *
 * @return {string}           - The code either prettified or not
 */
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
	blendPkg,
	stripScope,
	formatCode,
};
