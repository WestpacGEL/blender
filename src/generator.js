/**
 * All functions for the generator
 *
 * generator      - Generate files from our blender packages
 **/
const path = require('path');

const { generateTokenFile } = require('./generate-tokens.js');
const { generateCssHtml } = require('./generate-css-html.js');
const { generateJSFile } = require('./generate-js.js');
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
		.filter((pkg) => pkg.pkg.isCore)
		.map((core) => {
			if (SETTINGS.get.outputCss && core.pkg.recipe) {
				const { css, html } = generateCssHtml(core);

				// add css & html to FILES store
			}

			if (SETTINGS.get.outputJs && core.pkg.jquery && SETTINGS.get.includeJquery) {
				// get jquery
			}
		});

	// Building rest of packages (drawing rest of the f** owl)
	LOADING.start = { total: packages.length };
	packages
		.filter((pkg) => !pkg.pkg.isCore)
		.map((thisPackage) => {
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

				if (thisPackage.pkg.recipe) {
					const parsedPkg = generateCssHtml(thisPackage);

					if (parsedPkg.code > 0) {
						result.code = 1;
						result.errors = [...result.errors, ...parsedPkg.errors];
						result.messages = [...result.messages, ...parsedPkg.messages];
					}

					// Building CSS
					if (SETTINGS.get.outputCSS && thisPackage.pkg.recipe) {
						D.log(`Creating css files`);

						// console.log(parsedPkg.css);

						const filePath = SETTINGS.get.outputCss || SETTINGS.get.output;
						console.log(`include css for ${thisPackage.name}`);
					}

					// Building HTML
					if (SETTINGS.get.outputHtml && thisPackage.pkg.recipe) {
						D.log(`Creating html files`);

						// console.log(parsedPkg.html);

						const filePath = SETTINGS.get.outputHtml || SETTINGS.get.output;
						console.log(`include html for ${thisPackage.name}`);
					}
				}
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
