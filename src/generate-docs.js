/**
 * All functions to generate docs files
 *
 * generateDocsFile     - TODO
 * generateIndexFile    - TODO
 * generateDocsScaffold - Return all files around docs
 **/
const path = require('path');

const { SETTINGS } = require('./settings.js');

function generateDocsFile(html, htmlPath, cssPath, cssName) {
	const outputHtml = path.resolve(SETTINGS.get.cwd, htmlPath);
	const outputPath = path.resolve(SETTINGS.get.cwd, cssPath);
	const cssFile = path.relative(outputHtml, outputPath);

	return `<!DOCTYPE html>
<html>
<head>
	<title>GEL blend</title>
	<link rel=stylesheet href="${path.normalize(`${cssFile}/${cssName}`)}">
</head>
<body>
	<h1>GEL BLEND</h1>

	${html}
</body>
</html>
`;
}

function generateIndexFile(docs) {
	return `<!DOCTYPE html>
<html>
<head>
	<title>GEL blend</title>
	<link rel=stylesheet href="assets/docs.min.css">
</head>
<body class="GEL-core-v1_1_0">
	<div class="GEL-grid-container-v1_0_0">
		<div class="GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0">
			<div class="GEL-grid-cell-v1_0_0">
				<header>
					<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 53">
						<path fill="#263238" fill-rule="nonzero" d="M27 0c12.2 0 23 5.5 24 18.9H36.4c-.8-4.8-3.9-7.3-9.3-7.3-7.3 0-11.7 5.6-11.7 14.8v.6c0 8.3 3.1 14.8 12 14.8 7.2 0 10-3.7 10.3-7.8H28V23.8h24.2V30C52.2 43 43.6 53 27 53 9.5 53 0 42.2 0 26.8v-.6C0 10.6 11.5 0 27 0zm65.1.8V12H71.2V21H88v10.5H71.2v9.3h22V52H56.6V.8h35.6zm20.5 0v40H132V52H97.7V.8h14.9z"/>
					</svg>
				</header>

				<main>
					<section>
						<h1>Your ${SETTINGS.get.brand.toUpperCase()} Design System blend</h1>
						<p class="lead">
							This page contains the documentation of each package you blended with the ${SETTINGS.get.brand.toUpperCase()} blender.
						</p>
					</section>

					<section>
						<h2>Your packages</h2>

						<ul>
							${docs
								.map(
									(doc) => `<li><a href="${doc.path.replace('/docs/', '')}">${doc.name}</a></li>`
								)
								.join('\n\t\t')}
						</ul>
					</section>

					<section>
						<h2>Your web fonts</h2>
						<p class="lead">
							The license agreements for web fonts don’t allow us to distribute them with the blender. However, for those who work at Westpac we provide an internal
							link to the web font package for each blend within our internal network. Please click the link below to download the webfont.
						</p>
						<p>
							<a href="https://sites.thewestpacgroup.com.au/sites/TS1206/Shared%20Documents/webfonts/" target="_blank" rel="noopener">
								Download the web fonts for this blend
							</a>
						</p>
					</section>

					<section class="clear">
						<svg class="enjoy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 229">
							<g fill="none" fill-rule="evenodd">
								<path fill="#8E6E63" fill-rule="nonzero" d="M0 0v178.5h121.25v-9.501H11V90.5h102.5V81H11V9.499h109V0zM133.25 50h9.5v27.5h.5c1.664-4.832 4.039-9.125 7.125-12.875A47.302 47.302 0 01161.125 55c4.082-2.664 8.539-4.664 13.375-6 4.832-1.332 9.75-2 14.75-2 7.5 0 13.875.918 19.125 2.75 5.25 1.836 9.539 4.25 12.875 7.25 3.332 3 5.957 6.375 7.875 10.125 1.914 3.75 3.289 7.543 4.125 11.375.832 3.836 1.332 7.543 1.5 11.125.164 3.586.25 6.71.25 9.375v79.5h-9.5V97.25c0-3.164-.25-7.164-.75-12-.5-4.832-1.961-9.457-4.375-13.875-2.418-4.414-6.086-8.207-11-11.375-4.918-3.164-11.711-4.75-20.375-4.75-7.336 0-13.836 1.336-19.5 4-5.668 2.668-10.5 6.375-14.5 11.125s-7.043 10.418-9.125 17c-2.086 6.586-3.125 13.793-3.125 21.625v69.5h-9.5V50zM260.249 25.75h9.5V0h-9.5v25.75zm9.5 24.25v142.25c0 4.332-.336 8.457-1 12.375-.668 3.914-1.961 7.332-3.875 10.25-1.918 2.914-4.586 5.25-8 7-3.418 1.75-7.875 2.625-13.375 2.625h-6a8.377 8.377 0 01-2-.25v-8.5c.836.164 1.75.289 2.75.375 1 .082 2.168.125 3.5.125 3.332 0 6.164-.375 8.5-1.121 2.332-.754 4.25-2.082 5.75-3.996 1.5-1.915 2.582-4.497 3.25-7.739.664-3.246 1-7.281 1-12.105V50h9.5zM298.499 114.25c0 7.668 1.082 15.043 3.25 22.125 2.164 7.086 5.332 13.375 9.5 18.875 4.164 5.5 9.332 9.875 15.5 13.125 6.164 3.25 13.25 4.875 21.25 4.875s15.082-1.625 21.25-4.875c6.164-3.25 11.332-7.625 15.5-13.125 4.164-5.5 7.332-11.79 9.5-18.875 2.164-7.082 3.25-14.457 3.25-22.125 0-7.664-1.086-15.04-3.25-22.125-2.168-7.082-5.336-13.375-9.5-18.875-4.168-5.5-9.336-9.875-15.5-13.125-6.168-3.25-13.25-4.875-21.25-4.875s-15.086 1.625-21.25 4.875c-6.168 3.25-11.336 7.625-15.5 13.125-4.168 5.5-7.336 11.793-9.5 18.875-2.168 7.086-3.25 14.46-3.25 22.125m-9.5 0c0-9.164 1.289-17.79 3.875-25.875 2.582-8.082 6.375-15.207 11.375-21.375 5-6.164 11.164-11.04 18.5-14.625 7.332-3.582 15.75-5.375 25.25-5.375s17.914 1.793 25.25 5.375c7.332 3.586 13.5 8.46 18.5 14.625 5 6.168 8.789 13.293 11.375 21.375 2.582 8.086 3.875 16.71 3.875 25.875 0 9.168-1.293 17.836-3.875 26-2.586 8.168-6.375 15.293-11.375 21.375-5 6.086-11.168 10.918-18.5 14.5-7.336 3.582-15.75 5.375-25.25 5.375s-17.918-1.793-25.25-5.375c-7.336-3.582-13.5-8.414-18.5-14.5-5-6.082-8.793-13.207-11.375-21.375-2.586-8.164-3.875-16.832-3.875-26"/>
								<path fill="#FFF" fill-rule="nonzero" stroke="#8E6E63" stroke-width="3" d="M399.45 36.755c-.957 0-1.859.269-2.609.753a4.425 4.425 0 00-1.716 2.08c-.355.89-.373 1.822-.123 2.707.246.871.757 1.695 1.44 2.348l71.35 68v95.945c-11.054.205-20.928 1.129-28.115 2.5-3.905.745-7.035 1.63-9.17 2.592-1.186.536-2.09 1.11-2.705 1.688-.883.83-1.244 1.71-1.244 2.562 0 .882.385 1.796 1.333 2.655.66.598 1.633 1.19 2.907 1.742 2.309.999 5.69 1.908 9.895 2.66 8.033 1.439 19.137 2.332 31.432 2.332 12.302 0 23.44-.894 31.503-2.334 4.215-.753 7.607-1.662 9.924-2.66 1.277-.55 2.252-1.143 2.914-1.74.952-.858 1.338-1.773 1.338-2.655 0-.852-.36-1.732-1.234-2.562-.611-.579-1.51-1.155-2.691-1.692-2.12-.963-5.23-1.849-9.115-2.594-7.131-1.368-16.94-2.29-27.973-2.494v-95.945l70.999-67.59c.669-.64 1.15-1.565 1.356-2.563.206-.995.136-2.043-.206-2.899-.37-.92-1.001-1.518-1.79-1.893-.755-.359-1.684-.492-2.634-.492l-145.065-.45z"/>
								<path fill="#FFA726" fill-rule="nonzero" d="M435.731 75.91l36.286 34.726 36.285-34.734 13.196-12.646h-98.961z"/>
								<path stroke="#8D6E63" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.155" d="M516.957 5.784L477.78 81.433"/>
								<path fill="#D50000" fill-rule="nonzero" d="M490.389 87.964c-3.605 6.963-12.174 9.685-19.138 6.078-6.963-3.605-9.684-12.174-6.08-19.138 3.608-6.962 12.176-9.684 19.14-6.08 6.963 3.608 9.684 12.176 6.078 19.14"/>
								<path fill="#F6CCCD" fill-rule="nonzero" d="M473.595 83.832a3.156 3.156 0 11-6.31-.002 3.156 3.156 0 016.31.002"/>
							</g>
						</svg>
					</section>
				</main>
			</div>
		</div>
	</div>
</body>
</html>
`;
}

/**
 * Return all files around docs
 *
 * @return {array} - An array of files
 */
function generateDocsScaffold() {
	const files = [];

	// adding docs css
	files.push({
		name: 'docs.min.css',
		path: 'assets/',
		content: `
/*! @westpac/core v1.0.0-beta.1 blended with blender v1.0.0-beta.1 */
.GEL-core-v1_1_0{line-height:1.428571429;font-feature-settings:"liga" 1;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;}.GEL-core-v1_1_0 *:focus{outline:solid #000;outline-width:2px;outline-offset:3px;}.GEL-core-v1_1_0 [type="button"]:-moz-focusring,.GEL-core-v1_1_0 [type="reset"]:-moz-focusring,.GEL-core-v1_1_0 [type="submit"]:-moz-focusring,.GEL-core-v1_1_0 button:-moz-focusring{outline:solid #000;outline-width:2px;outline-offset:3px;}.GEL-core-v1_1_0 *::selection{background-color:#c80038;}.GEL-core-v1_1_0{/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */}.GEL-core-v1_1_0 html{line-height:1.15;-webkit-text-size-adjust:100%;}.GEL-core-v1_1_0 body{margin:0;}.GEL-core-v1_1_0 main{display:block;}.GEL-core-v1_1_0 h1{font-size:2em;margin:0.67em 0;}.GEL-core-v1_1_0 hr{box-sizing:content-box;height:0;overflow:visible;}.GEL-core-v1_1_0 pre{font-family:monospace,monospace;font-size:1em;}.GEL-core-v1_1_0 a{background-color:transparent;}.GEL-core-v1_1_0 abbr[title]{border-bottom:none;-webkit-text-decoration:underline;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;}.GEL-core-v1_1_0 b,.GEL-core-v1_1_0 strong{font-weight:bolder;}.GEL-core-v1_1_0 code,.GEL-core-v1_1_0 kbd,.GEL-core-v1_1_0 samp{font-family:monospace,monospace;font-size:1em;}.GEL-core-v1_1_0 small{font-size:80%;}.GEL-core-v1_1_0 sub,.GEL-core-v1_1_0 sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}.GEL-core-v1_1_0 sub{bottom:-0.25em;}.GEL-core-v1_1_0 sup{top:-0.5em;}.GEL-core-v1_1_0 img{border-style:none;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 input,.GEL-core-v1_1_0 optgroup,.GEL-core-v1_1_0 select,.GEL-core-v1_1_0 textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 input{overflow:visible;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 select{text-transform:none;}.GEL-core-v1_1_0 [type='button'],.GEL-core-v1_1_0 [type='reset'],.GEL-core-v1_1_0 [type='submit'],.GEL-core-v1_1_0 button{-webkit-appearance:button;}.GEL-core-v1_1_0 [type='button']::-moz-focus-inner,.GEL-core-v1_1_0 [type='reset']::-moz-focus-inner,.GEL-core-v1_1_0 [type='submit']::-moz-focus-inner,.GEL-core-v1_1_0 button::-moz-focus-inner{border-style:none;padding:0;}.GEL-core-v1_1_0 [type='button']:-moz-focusring,.GEL-core-v1_1_0 [type='reset']:-moz-focusring,.GEL-core-v1_1_0 [type='submit']:-moz-focusring,.GEL-core-v1_1_0 button:-moz-focusring{outline:1px dotted ButtonText;}.GEL-core-v1_1_0 fieldset{padding:0.35em 0.75em 0.625em;}.GEL-core-v1_1_0 legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}.GEL-core-v1_1_0 progress{vertical-align:baseline;}.GEL-core-v1_1_0 textarea{overflow:auto;}.GEL-core-v1_1_0 [type='checkbox'],.GEL-core-v1_1_0 [type='radio']{box-sizing:border-box;padding:0;}.GEL-core-v1_1_0 [type='number']::-webkit-inner-spin-button,.GEL-core-v1_1_0 [type='number']::-webkit-outer-spin-button{height:auto;}.GEL-core-v1_1_0 [type='search']{-webkit-appearance:textfield;outline-offset:-2px;}.GEL-core-v1_1_0 [type='search']::-webkit-search-decoration{-webkit-appearance:none;}.GEL-core-v1_1_0::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}.GEL-core-v1_1_0 details{display:block;}.GEL-core-v1_1_0 summary{display:list-item;}.GEL-core-v1_1_0 template{display:none;}.GEL-core-v1_1_0 [hidden]{display:none;}
/*! @westpac/grid v1.0.0-beta.1 blended with blender v1.0.0-beta.1 */
.GEL-grid-container-v1_0_0{margin-left:auto;margin-right:auto;max-width:82.5rem;padding-left:0.75rem;padding-right:0.75rem;}@media (min-width:576px){.GEL-grid-container-v1_0_0{padding-left:1.125rem;padding-right:1.125rem;}}@media (min-width:768px){.GEL-grid-container-v1_0_0{padding-left:2.25rem;padding-right:2.25rem;}}@media (min-width:992px){.GEL-grid-container-v1_0_0{padding-left:3rem;padding-right:3rem;}}@media (min-width:1200px){.GEL-grid-container-v1_0_0{padding-left:3.75rem;padding-right:3.75rem;}}.GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0{display:grid;grid-auto-flow:row;grid-auto-rows:minmax(2rem,auto);grid-gap:0.75rem;grid-template-columns:repeat(12,1fr);height:auto;}@media (min-width:576px){.GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0{grid-gap:1.5rem;}}.GEL-grid-cell-v1_0_0{grid-column-end:span 12;grid-column-start:0;grid-row-end:span 1;height:100%;min-width:0;}@media (min-width:576px){.GEL-grid-cell-v1_0_0{grid-column-end:span 10;grid-column-start:2;}}@media (min-width:768px){.GEL-grid-cell-v1_0_0{grid-column-end:span 8;grid-column-start:3;}}@media (min-width:992px){.GEL-grid-cell-v1_0_0{grid-column-end:span 6;grid-column-start:4;}}
/* Docs styles */
body {
	background: #f4f3f0;
	color: #263238;
	font-weight: 300;
}
header {
	margin: 10rem 0 3.125rem 0;
}
section + section {
	margin-top: 2.5rem;
}
section.clear {
	overflow: hidden;
	margin: 5rem 0;
}
a {
	color: #263238;
	display: inline-block;
	text-decoration: none;
}
a:before {
	content: '';
	display: inline-block;
	width: 0.7rem;
	height: 0.75rem;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7 12'%3E%3Cpath fill='%23C80038' fill-rule='evenodd' d='M4.73 6l-4.4 4.39.94.94L6.61 6 1.27.67l-.94.94z'/%3E%3C/svg%3E") no-repeat;
}
a:hover, a:active, a:focus {
	text-decoration: underline;
}
ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
li {
	margin-bottom: 0.2rem;
}
.logo {
	max-width: 8.25rem;
	height: auto;
}
h1 {
	font-size: 1.875rem;
	font-weight: bold;
	margin: 0 0 2.1875rem 0;
}
h2 {
	font-size: 1.125rem;
	font-weight: bold;
	margin: 0 0 1.25rem 0;
}
.lead {
	font-size: 1rem;
	line-height: 2;
}
.enjoy {
	max-width: 15rem;
	height: auto;
	float: right
}
`,
	});

	return files;
}

module.exports = exports = {
	generateDocsFile,
	generateIndexFile,
	generateDocsScaffold,
};
