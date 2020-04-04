/**
 * All functions for the generator
 *
 * generator     - Generate files from our blender packages
 **/
const path = require('path');

const { generateTokenFile } = require('./generate-tokens.js');
const { generateHTMLFile } = require('./generate-html.js');
const { generateCSSFile } = require('./generate-css.js');
const { generateJSFile } = require('./generate-js.js');
const { parseComponent } = require('./parseCss.js');
const { testLabels } = require('./tester.js');
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

	// Building core
	packages
		.filter((pkg) => pkg.pkg.isCore) // we filter out all core packages
		.map((core) => {
			if (SETTINGS.get.outputCss && core.pkg.recipe) {
				const parsedPkg = parseComponent({
					componentPath: path.normalize(`${core.path}/${core.pkg.recipe}`),
					componentName: 'AllStyles',
				});
				console.log(testLabels(parsedPkg));
				console.log(parsedPkg);
				// get core styles
			}

			if (SETTINGS.get.outputJs && core.pkg.jquery && SETTINGS.get.includeJquery) {
				// get jquery
			}
		});

	LOADING.start = { total: packages.length };
	packages.map((thisPackage) => {
		D.log(`generating for ${color.yellow(thisPackage.name)}`);

		// Building tokens
		if (SETTINGS.get.outputTokens && thisPackage.pkg.tokens) {
			const compiledTokens = generateTokenFile(thisPackage.path, SETTINGS.get.tokensFormat);

			let filePath = SETTINGS.get.outputTokens || SETTINGS.get.output;
			if (SETTINGS.get.outputZip) {
				filePath = 'blender/';
			}
			const name = `tokens.${SETTINGS.get.tokensFormat}`;

			D.log(
				`Adding tokens to store at path ${color.yellow(filePath)} and name ${color.yellow(name)}`
			);
			FILES.add = {
				name,
				path: filePath,
				content: compiledTokens,
			};
		}

		// parse recipe once if either html or css output is enabled
		let parsedData = {};
		if (
			(SETTINGS.get.outputCSS && thisPackage.pkg.recipe) ||
			(SETTINGS.get.outputHtml && thisPackage.pkg.recipe)
		) {
			D.log(`Parsing package`);

			let parsedPkg;
			if (thisPackage.pkg.recipe) {
				parsedPkg = parseComponent({
					componentPath: path.normalize(`${thisPackage.path}/${thisPackage.pkg.recipe}`),
					componentName: 'AllStyles',
				});

				if (parsedPkg.status === 'error') {
					result.errors.push({
						package: thisPackage.name,
						error: parsedPkg.message,
					});
					result.messages.push(parsedPkg.message);
					result.code = 1;
				}
			}

			parsedData[thisPackage.name] = parsedPkg;
		}

		// Building CSS
		if (SETTINGS.get.outputCSS && thisPackage.pkg.recipe) {
			D.log(`Creating css files`);

			const filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
			const { css } = parsedData[thisPackage.name];
			const cssFiles = generateCSSFile(css);
			// add cssFiles to file store

			console.log(`include css for ${thisPackage.name}`);
		}

		// Building HTML
		if (SETTINGS.get.outputHtml && thisPackage.pkg.recipe) {
			D.log(`Creating html files`);

			const filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
			const { html } = parsedData[thisPackage.name];
			const htmlFiles = generateHTMLFile(html);
			// add htmlFiles to file store

			console.log(`include html for ${thisPackage.name}`);
		}

		// Building JS
		if (SETTINGS.get.outputJs && thisPackage.pkg.jquery) {
			D.log(`Creating js files`);

			const filePath = SETTINGS.get.outputJs || SETTINGS.get.output;
			const jsFiles = generateJSFile(thisPackage);
			// add jsFiles to file store

			console.log(`include js for ${thisPackage.name}`);
		}

		LOADING.tick();
	});
	LOADING.abort();

	D.log(`tester return: "${color.yellow(JSON.stringify(result))}"`);

	return result;
}

module.exports = exports = {
	generator,
};
