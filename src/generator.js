/**
 * All functions for the generator
 *
 * generator  - Generate files from our blender packages
 * blendPkg   - Generate CSS, Js, tokens and HTML from a package
 * stripScope - Strip the scope from a package name
 * formatCode - Prettifying js or css
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
	let coreCss = ''; // we need to keep a record of the core css so we can remove it from each component later
	let coreHtml = ''; // we need to keep a record of the core html so we can remove it from each component later
	const docs = []; // keeping track of all docs we add for building the index

	LOADING.start = { total: packages.length };

	let cssMinFilePath = SETTINGS.get.outputCss || '';
	if (SETTINGS.get.outputZip) {
		cssMinFilePath = 'blender/';
	}
	cssMinFilePath = path.normalize(`${cssMinFilePath}/css/`);
	const cssMinName = `styles${SETTINGS.get.prettify ? '' : '.min'}.css`;

	// Building core first so we can remove it from other packages
	packages
		.filter((pkg) => pkg.pkg.isCore)
		.map((core) => {
			const { oldCss, oldHtml, js, css, html } = blendPkg({
				thisPkg: core,
				includeJs: !!SETTINGS.get.outputJs && !SETTINGS.get.excludeJquery,
				children: 'CORE',
			});

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

	// Building rest of packages (drawing the rest of the f** owl)
	packages
		.filter((pkg) => !pkg.pkg.isCore)
		.map((thisPkg) => {
			const { css, js, html } = blendPkg({
				thisPkg,
				coreCss,
				coreHtml,
			});

			// we collect all css and js for a possible concatenated css/js file
			cssFile += css;
			jsFile += js;
			if (html) {
				docs.push(html);
			}

			LOADING.tick();
		});

	if (!SETTINGS.get.modules) {
		// Add the css we collected from all packages
		D.log(`Adding css to store at path ${color.yellow(cssMinFilePath + cssMinName)}`);
		FILES.add = {
			name: cssMinName,
			filePath: cssMinFilePath,
			content: formatCode(cssFile, 'css'),
		};

		// Add the js we collected from all packages
		let filePath = SETTINGS.get.outputJs || '';
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/js/`);
		const name = `script${SETTINGS.get.prettify ? '' : '.min'}.js`;

		D.log(`Adding js to store at path ${color.yellow(filePath + name)}`);
		FILES.add = {
			name,
			filePath: filePath,
			content: formatCode(jsFile, 'js'),
		};
	}

	// Add the index docs file
	if (SETTINGS.get.outputHtml && docs.length) {
		const index = generateIndexFile(docs);

		let filePath = SETTINGS.get.outputHtml || '';
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/docs/`);
		const name = `index.html`;

		// adding index file
		FILES.add = {
			name: 'index.html',
			filePath: filePath,
			content: index,
		};

		// adding css file to docs
		FILES.add = {
			name: 'styles.min.css',
			filePath: path.normalize(`${filePath}/assets/`),
			content: cssFile,
		};

		// adding each docs assets file
		generateDocsAssets().map((file) => {
			FILES.add = {
				name: file.name,
				filePath: path.normalize(`${filePath}/${file.path}`),
				content: file.content,
			};
		});
	}

	LOADING.abort();

	D.log(`generator return: "${color.yellow(JSON.stringify(result))}"`);

	return {
		...result,
		files: [...FILES.get],
	};
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
function blendPkg({
	thisPkg,
	coreCss = '',
	coreHtml = '',
	includeTokens = !!SETTINGS.get.outputTokens,
	includeCss = !!SETTINGS.get.outputCss,
	includeJs = !!SETTINGS.get.outputJs,
	includeHtml = !!SETTINGS.get.outputHtml,
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
		D.log(`Creating tokens for ${color.yellow(thisPkg.name)}`);

		const compiledTokens = generateTokenFile(thisPkg.path, SETTINGS.get.tokensFormat);

		let filePath = SETTINGS.get.outputTokens || '';
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/tokens/`);
		const name = `tokens.${SETTINGS.get.tokensFormat}`;

		D.log(`Adding tokens to store at path ${color.yellow(filePath + name)}`);
		FILES.add = {
			name,
			filePath: filePath,
			content: compiledTokens,
		};
	}

	// Building CSS
	if (includeCss && thisPkg.pkg.recipe) {
		D.log(`Creating css for ${color.yellow(thisPkg.name)}`);
		const { css, oldCss, oldHtml, ...parsedPkg } = generateCss({ pkg: thisPkg, coreCss, children });

		if (parsedPkg.code > 0) {
			result.code = 1;
			result.errors = [...result.errors, ...parsedPkg.errors];
		}
		result.messages = [...result.messages, ...parsedPkg.messages];

		// keeping track of unmodified css and html so we can remove it from the output later
		result.oldCss = oldCss;
		result.oldHtml = oldHtml;
		result.css = `${css}\n`;

		// keeping track of the css path
		let filePath = SETTINGS.get.outputCss || '';
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		filePath = path.normalize(`${filePath}/css/`);
		const name = `${stripScope(thisPkg.name)}${SETTINGS.get.prettify ? '' : '.min'}.css`;

		// save each file into its own module
		if (SETTINGS.get.modules) {
			D.log(
				`Adding ${color.yellow(thisPkg.name)} css to store at path ${color.yellow(filePath + name)}`
			);
			FILES.add = {
				name: name,
				filePath: filePath,
				content: formatCode(css, 'css'),
			};
		}
	}

	// Building HTML
	if (includeHtml && thisPkg.pkg.recipe) {
		D.log(`Creating html file for ${color.yellow(thisPkg.name)}`);

		let filePath = SETTINGS.get.outputHtml || '';
		if (SETTINGS.get.outputZip) {
			filePath = 'blender/';
		}
		const docsPath = `/docs/packages/`;
		filePath = path.normalize(filePath + docsPath);
		const name = `${stripScope(thisPkg.name)}.html`;

		const { html, ...parsedPkg } = generateHtml({
			pkg: thisPkg,
			coreHtml,
		});

		if (parsedPkg.code > 0) {
			result.code = 1;
			result.errors = [...result.errors, ...parsedPkg.errors];
		}
		result.messages = [...result.messages, ...parsedPkg.messages];

		result.html = {
			name: thisPkg.name,
			path: docsPath + name,
		};

		D.log(
			`Adding ${color.yellow(thisPkg.name)} html to store at path ${color.yellow(filePath + name)}`
		);
		FILES.add = {
			name,
			filePath: filePath,
			content: html,
		};
	}

	// Building JS
	if (includeJs && thisPkg.pkg.js) {
		D.log(`Creating js for ${color.yellow(thisPkg.name)}`);
		const { js, ...rest } = generateJSFile(thisPkg);

		if (rest.code > 0) {
			result.code = 1;
			result.messages = [...result.messages, ...rest.message];
		}

		result.js = `${js}\n`;

		// save each file into its own module
		if (SETTINGS.get.modules) {
			let filePath = SETTINGS.get.outputJs || '';
			if (SETTINGS.get.outputZip) {
				filePath = 'blender/';
			}
			filePath = path.normalize(`${filePath}/js/`);
			const name = `${stripScope(thisPkg.name)}${SETTINGS.get.prettify ? '' : '.min'}.js`;

			D.log(
				`Adding ${color.yellow(thisPkg.name)} js to store at path ${color.yellow(filePath + name)}`
			);
			FILES.add = {
				name,
				filePath: filePath,
				content: formatCode(js, 'js'),
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
