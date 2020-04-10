/**
 * All functions to generate docs files
 *
 * generateDocsFile   - Generate a docs file for a package
 * generateIndexFile  - Generate the index docs file
 * generateDocsAssets - Return all files around docs
 **/
const path = require('path');
const fs = require('fs');

const { indentHtml } = require('./indentHtml.js');
const { SETTINGS } = require('./settings.js');
const { D } = require('./log.js');

/**
 * Generate a docs file for a package
 *
 * @param  {string} name     - The name of the package
 * @param  {array}  html     - An array of all the variations of this package pre-parsed
 *
 * @return {string}          - The html doc for this component
 */
function generateDocsFile(name, html) {
	D.header('generateDocsFile', { name, html });

	const recipes = html
		.map(
			(variation) =>
				`<section>` +
				`<h2>${variation.heading}</h2>\n` +
				`<div class="codeBox">${variation.html}</div>\n` +
				`<pre><code class="language-html">${indentHtml(variation.html)
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#039;')}</code></pre>` +
				`</section>`
		)
		.join('\n');

	return `<!DOCTYPE html>
<html>
<head>
	<title>GEL blend</title>
	<link rel=stylesheet href="../assets/docs.min.css">
	<link rel=stylesheet href="../assets/styles.min.css">
</head>
<body class="GEL-core-v1_1_0">
	<div class="GEL-grid-container-v1_0_0">
		<header class="small">
			<a class="back" href="../index.html">Back to your components</a>
		</header>

		<div class="GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0">
			<div class="GEL-grid-cell-v1_0_0">
				<h1>${name}</h1>
				${recipes}
			</div>
		</div>
	</div>

	<script src="../assets/docs.min.js"></script>
</body>
</html>
`;
}

/**
 * Generate the index docs file
 *
 * @param  {array}  docs - An array of all packages in this blend
 *
 * @return {string}      - The index html
 */
function generateIndexFile(docs) {
	D.header('generateIndexFile', { docs });

	const brand = SETTINGS.get.brand.startsWith('@') ? 'Westpac' : SETTINGS.get.brand.toUpperCase();

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
						<h1>Your ${brand} Design System blend</h1>
						<p class="lead">
							This page contains the documentation of each package you blended with the ${brand} blender.
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
 * Return all assets files around docs
 *
 * @return {array} - An array of files
 */
function generateDocsAssets() {
	D.header('generateDocsAssets');

	const files = [];

	// adding docs css
	files.push({
		name: 'docs.min.css',
		path: 'assets/',
		content: `/*! @westpac/core v1.0.0-beta.1 blended with blender v1.0.0-beta.1 */
.GEL-core-v1_1_0{line-height:1.428571429;font-feature-settings:"liga" 1;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;}.GEL-core-v1_1_0 *:focus{outline:solid #000;outline-width:2px;outline-offset:3px;}.GEL-core-v1_1_0 [type="button"]:-moz-focusring,.GEL-core-v1_1_0 [type="reset"]:-moz-focusring,.GEL-core-v1_1_0 [type="submit"]:-moz-focusring,.GEL-core-v1_1_0 button:-moz-focusring{outline:solid #000;outline-width:2px;outline-offset:3px;}.GEL-core-v1_1_0 *::selection{background-color:#f4ccd7;}.GEL-core-v1_1_0{/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */}.GEL-core-v1_1_0 html{line-height:1.15;-webkit-text-size-adjust:100%;}.GEL-core-v1_1_0 body{margin:0;}.GEL-core-v1_1_0 main{display:block;}.GEL-core-v1_1_0 h1{font-size:2em;margin:0.67em 0;}.GEL-core-v1_1_0 hr{box-sizing:content-box;height:0;overflow:visible;}.GEL-core-v1_1_0 pre{font-family:monospace,monospace;font-size:1em;}.GEL-core-v1_1_0 a{background-color:transparent;}.GEL-core-v1_1_0 abbr[title]{border-bottom:none;-webkit-text-decoration:underline;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;}.GEL-core-v1_1_0 b,.GEL-core-v1_1_0 strong{font-weight:bolder;}.GEL-core-v1_1_0 code,.GEL-core-v1_1_0 kbd,.GEL-core-v1_1_0 samp{font-family:monospace,monospace;font-size:1em;}.GEL-core-v1_1_0 small{font-size:80%;}.GEL-core-v1_1_0 sub,.GEL-core-v1_1_0 sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}.GEL-core-v1_1_0 sub{bottom:-0.25em;}.GEL-core-v1_1_0 sup{top:-0.5em;}.GEL-core-v1_1_0 img{border-style:none;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 input,.GEL-core-v1_1_0 optgroup,.GEL-core-v1_1_0 select,.GEL-core-v1_1_0 textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 input{overflow:visible;}.GEL-core-v1_1_0 button,.GEL-core-v1_1_0 select{text-transform:none;}.GEL-core-v1_1_0 [type='button'],.GEL-core-v1_1_0 [type='reset'],.GEL-core-v1_1_0 [type='submit'],.GEL-core-v1_1_0 button{-webkit-appearance:button;}.GEL-core-v1_1_0 [type='button']::-moz-focus-inner,.GEL-core-v1_1_0 [type='reset']::-moz-focus-inner,.GEL-core-v1_1_0 [type='submit']::-moz-focus-inner,.GEL-core-v1_1_0 button::-moz-focus-inner{border-style:none;padding:0;}.GEL-core-v1_1_0 [type='button']:-moz-focusring,.GEL-core-v1_1_0 [type='reset']:-moz-focusring,.GEL-core-v1_1_0 [type='submit']:-moz-focusring,.GEL-core-v1_1_0 button:-moz-focusring{outline:1px dotted ButtonText;}.GEL-core-v1_1_0 fieldset{padding:0.35em 0.75em 0.625em;}.GEL-core-v1_1_0 legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}.GEL-core-v1_1_0 progress{vertical-align:baseline;}.GEL-core-v1_1_0 textarea{overflow:auto;}.GEL-core-v1_1_0 [type='checkbox'],.GEL-core-v1_1_0 [type='radio']{box-sizing:border-box;padding:0;}.GEL-core-v1_1_0 [type='number']::-webkit-inner-spin-button,.GEL-core-v1_1_0 [type='number']::-webkit-outer-spin-button{height:auto;}.GEL-core-v1_1_0 [type='search']{-webkit-appearance:textfield;outline-offset:-2px;}.GEL-core-v1_1_0 [type='search']::-webkit-search-decoration{-webkit-appearance:none;}.GEL-core-v1_1_0::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}.GEL-core-v1_1_0 details{display:block;}.GEL-core-v1_1_0 summary{display:list-item;}.GEL-core-v1_1_0 template{display:none;}.GEL-core-v1_1_0 [hidden]{display:none;}
/*! @westpac/grid v1.0.0-beta.1 blended with blender v1.0.0-beta.1 */
.GEL-grid-container-v1_0_0{margin-left:auto;margin-right:auto;max-width:82.5rem;padding-left:0.75rem;padding-right:0.75rem;}@media (min-width:576px){.GEL-grid-container-v1_0_0{padding-left:1.125rem;padding-right:1.125rem;}}@media (min-width:768px){.GEL-grid-container-v1_0_0{padding-left:2.25rem;padding-right:2.25rem;}}@media (min-width:992px){.GEL-grid-container-v1_0_0{padding-left:3rem;padding-right:3rem;}}@media (min-width:1200px){.GEL-grid-container-v1_0_0{padding-left:3.75rem;padding-right:3.75rem;}}.GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0{display:grid;grid-auto-flow:row;grid-auto-rows:minmax(2rem,auto);grid-gap:0.75rem;grid-template-columns:repeat(12,1fr);height:auto;}@media (min-width:576px){.GEL-grid-flow_row-height_auto-minRowHeight_2rem-v1_0_0{grid-gap:1.5rem;}}.GEL-grid-cell-v1_0_0{grid-column-end:span 12;grid-column-start:0;grid-row-end:span 1;height:100%;min-width:0;}@media (min-width:576px){.GEL-grid-cell-v1_0_0{grid-column-end:span 10;grid-column-start:2;}}@media (min-width:768px){.GEL-grid-cell-v1_0_0{grid-column-end:span 8;grid-column-start:3;}}@media (min-width:992px){.GEL-grid-cell-v1_0_0{grid-column-end:span 6;grid-column-start:4;}}
/* PrismJS 1.20.0 https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup */
/* prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML Based on https://github.com/chriskempson/tomorrow-theme @author Rose Pritchard */
code[class*="language-"],pre[class*="language-"]{color:#ccc;background:none;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:2;-o-tab-size:2;tab-size:2;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*="language-"]{padding:1em;overflow:auto}:not(pre) > code[class*="language-"],pre[class*="language-"]{background:#2d2d2d}:not(pre) > code[class*="language-"]{padding:0.1em;border-radius:0.3em;white-space:normal}.token.block-comment,.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#999}.token.punctuation{color:#ccc}.token.attr-name,.token.deleted,.token.namespace,.token.tag{color:#e2777a}.token.function-name{color:#6196cc}.token.boolean,.token.function,.token.number{color:#f08d49}.token.class-name,.token.constant,.token.property,.token.symbol{color:#f8c555}.token.atrule,.token.builtin,.token.important,.token.keyword,.token.selector{color:#cc99cd}.token.attr-value,.token.char,.token.regex,.token.string,.token.variable{color:#7ec699}.token.entity,.token.operator,.token.url{color:#67cdcc}.token.bold,.token.important{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}.token.inserted{color:green}
/* Docs styles */
body {
	background: #f4f3f0;
	color: #263238;
	font-weight: 300;
	margin-bottom: 5rem;
}
header {
	margin: 10rem 0 3.125rem 0;
}
header.small {
	margin-top: 2rem;
}
section + section {
	margin-top: 2.5rem;
}
section.clear {
	overflow: hidden;
	margin-top: 5rem;
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
a.back:before {
	width: 1rem;
	transform: rotate(180deg);
	background-position-x: 0.5rem;
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
.codeBox {
	background: #fff;
	overflow: auto;
	padding: 2rem;
	margin-bottom: 0;
}
pre {
	margin-top: 0;
	min-height: 3rem;
}
.enjoy {
	max-width: 15rem;
	height: auto;
	float: right
}
`,
	});

	// adding docs css
	files.push({
		name: 'docs.min.js',
		path: 'assets/',
		content: `/* PrismJS 1.20.0 https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(u){var c=/\\blang(?:uage)?-([\\w-]+)\\b/i,n=0,C={manual:u.Prism&&u.Prism.manual,disableWorkerMessageHandler:u.Prism&&u.Prism.disableWorkerMessageHandler,util:{encode:function e(n){return n instanceof _?new _(n.type,e(n.content),n.alias):Array.isArray(n)?n.map(e):n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++n}),e.__id},clone:function t(e,r){var a,n,l=C.util.type(e);switch(r=r||{},l){case"Object":if(n=C.util.objId(e),r[n])return r[n];for(var i in a={},r[n]=a,e)e.hasOwnProperty(i)&&(a[i]=t(e[i],r));return a;case"Array":return n=C.util.objId(e),r[n]?r[n]:(a=[],r[n]=a,e.forEach(function(e,n){a[n]=t(e,r)}),a);default:return e}},getLanguage:function(e){for(;e&&!c.test(e.className);)e=e.parentElement;return e?(e.className.match(c)||[,"none"])[1].toLowerCase():"none"},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(e){var n=(/at [^(\\r\\n]*\\((.*):.+:.+\\)$/i.exec(e.stack)||[])[1];if(n){var t=document.getElementsByTagName("script");for(var r in t)if(t[r].src==n)return t[r]}return null}}},languages:{extend:function(e,n){var t=C.util.clone(C.languages[e]);for(var r in n)t[r]=n[r];return t},insertBefore:function(t,e,n,r){var a=(r=r||C.languages)[t],l={};for(var i in a)if(a.hasOwnProperty(i)){if(i==e)for(var o in n)n.hasOwnProperty(o)&&(l[o]=n[o]);n.hasOwnProperty(i)||(l[i]=a[i])}var s=r[t];return r[t]=l,C.languages.DFS(C.languages,function(e,n){n===s&&e!=t&&(this[e]=l)}),l},DFS:function e(n,t,r,a){a=a||{};var l=C.util.objId;for(var i in n)if(n.hasOwnProperty(i)){t.call(n,i,n[i],r||i);var o=n[i],s=C.util.type(o);"Object"!==s||a[l(o)]?"Array"!==s||a[l(o)]||(a[l(o)]=!0,e(o,t,i,a)):(a[l(o)]=!0,e(o,t,null,a))}}},plugins:{},highlightAll:function(e,n){C.highlightAllUnder(document,e,n)},highlightAllUnder:function(e,n,t){var r={callback:t,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};C.hooks.run("before-highlightall",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),C.hooks.run("before-all-elements-highlight",r);for(var a,l=0;a=r.elements[l++];)C.highlightElement(a,!0===n,r.callback)},highlightElement:function(e,n,t){var r=C.util.getLanguage(e),a=C.languages[r];e.className=e.className.replace(c,"").replace(/\\s+/g," ")+" language-"+r;var l=e.parentNode;l&&"pre"===l.nodeName.toLowerCase()&&(l.className=l.className.replace(c,"").replace(/\\s+/g," ")+" language-"+r);var i={element:e,language:r,grammar:a,code:e.textContent};function o(e){i.highlightedCode=e,C.hooks.run("before-insert",i),i.element.innerHTML=i.highlightedCode,C.hooks.run("after-highlight",i),C.hooks.run("complete",i),t&&t.call(i.element)}if(C.hooks.run("before-sanity-check",i),!i.code)return C.hooks.run("complete",i),void(t&&t.call(i.element));if(C.hooks.run("before-highlight",i),i.grammar)if(n&&u.Worker){var s=new Worker(C.filename);s.onmessage=function(e){o(e.data)},s.postMessage(JSON.stringify({language:i.language,code:i.code,immediateClose:!0}))}else o(C.highlight(i.code,i.grammar,i.language));else o(C.util.encode(i.code))},highlight:function(e,n,t){var r={code:e,grammar:n,language:t};return C.hooks.run("before-tokenize",r),r.tokens=C.tokenize(r.code,r.grammar),C.hooks.run("after-tokenize",r),_.stringify(C.util.encode(r.tokens),r.language)},tokenize:function(e,n){var t=n.rest;if(t){for(var r in t)n[r]=t[r];delete n.rest}var a=new l;return M(a,a.head,e),function e(n,t,r,a,l,i,o){for(var s in r)if(r.hasOwnProperty(s)&&r[s]){var u=r[s];u=Array.isArray(u)?u:[u];for(var c=0;c<u.length;++c){if(o&&o==s+","+c)return;var g=u[c],f=g.inside,h=!!g.lookbehind,d=!!g.greedy,v=0,p=g.alias;if(d&&!g.pattern.global){var m=g.pattern.toString().match(/[imsuy]*$/)[0];g.pattern=RegExp(g.pattern.source,m+"g")}g=g.pattern||g;for(var y=a.next,k=l;y!==t.tail;k+=y.value.length,y=y.next){var b=y.value;if(t.length>n.length)return;if(!(b instanceof _)){var x=1;if(d&&y!=t.tail.prev){g.lastIndex=k;var w=g.exec(n);if(!w)break;var A=w.index+(h&&w[1]?w[1].length:0),P=w.index+w[0].length,S=k;for(S+=y.value.length;S<=A;)y=y.next,S+=y.value.length;if(S-=y.value.length,k=S,y.value instanceof _)continue;for(var O=y;O!==t.tail&&(S<P||"string"==typeof O.value&&!O.prev.value.greedy);O=O.next)x++,S+=O.value.length;x--,b=n.slice(k,S),w.index-=k}else{g.lastIndex=0;var w=g.exec(b)}if(w){h&&(v=w[1]?w[1].length:0);var A=w.index+v,w=w[0].slice(v),P=A+w.length,E=b.slice(0,A),N=b.slice(P),j=y.prev;E&&(j=M(t,j,E),k+=E.length),W(t,j,x);var L=new _(s,f?C.tokenize(w,f):w,p,w,d);if(y=M(t,j,L),N&&M(t,y,N),1<x&&e(n,t,r,y.prev,k,!0,s+","+c),i)break}else if(i)break}}}}}(e,a,n,a.head,0),function(e){var n=[],t=e.head.next;for(;t!==e.tail;)n.push(t.value),t=t.next;return n}(a)},hooks:{all:{},add:function(e,n){var t=C.hooks.all;t[e]=t[e]||[],t[e].push(n)},run:function(e,n){var t=C.hooks.all[e];if(t&&t.length)for(var r,a=0;r=t[a++];)r(n)}},Token:_};function _(e,n,t,r,a){this.type=e,this.content=n,this.alias=t,this.length=0|(r||"").length,this.greedy=!!a}function l(){var e={value:null,prev:null,next:null},n={value:null,prev:e,next:null};e.next=n,this.head=e,this.tail=n,this.length=0}function M(e,n,t){var r=n.next,a={value:t,prev:n,next:r};return n.next=a,r.prev=a,e.length++,a}function W(e,n,t){for(var r=n.next,a=0;a<t&&r!==e.tail;a++)r=r.next;(n.next=r).prev=n,e.length-=a}if(u.Prism=C,_.stringify=function n(e,t){if("string"==typeof e)return e;if(Array.isArray(e)){var r="";return e.forEach(function(e){r+=n(e,t)}),r}var a={type:e.type,content:n(e.content,t),tag:"span",classes:["token",e.type],attributes:{},language:t},l=e.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(a.classes,l):a.classes.push(l)),C.hooks.run("wrap",a);var i="";for(var o in a.attributes)i+=" "+o+'="'+(a.attributes[o]||"").replace(/"/g,"&quot;")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'"'+i+">"+a.content+"</"+a.tag+">"},!u.document)return u.addEventListener&&(C.disableWorkerMessageHandler||u.addEventListener("message",function(e){var n=JSON.parse(e.data),t=n.language,r=n.code,a=n.immediateClose;u.postMessage(C.highlight(r,C.languages[t],t)),a&&u.close()},!1)),C;var e=C.util.currentScript();function t(){C.manual||C.highlightAll()}if(e&&(C.filename=e.src,e.hasAttribute("data-manual")&&(C.manual=!0)),!C.manual){var r=document.readyState;"loading"===r||"interactive"===r&&e&&e.defer?document.addEventListener("DOMContentLoaded",t):window.requestAnimationFrame?window.requestAnimationFrame(t):window.setTimeout(t,16)}return C}(_self);"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.markup={comment:/<!--[\\s\\S]*?-->/,prolog:/<\\?[\\s\\S]+?\\?>/,doctype:{pattern:/<!DOCTYPE(?:[^>"'[\\]]|"[^"]*"|'[^']*')+(?:\\[(?:(?!<!--)[^"'\\]]|"[^"]*"|'[^']*'|<!--[\\s\\S]*?-->)*\\]\\s*)?>/i,greedy:!0},cdata:/<!\\[CDATA\\[[\\s\\S]*?]]>/i,tag:{pattern:/<\\/?(?!\\d)[^\\s>\\/=$<%]+(?:\\s(?:\\s*[^\\s>\\/=]+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))|(?=[\\s/>])))+)?\\s*\\/?>/i,greedy:!0,inside:{tag:{pattern:/^<\\/?[^\\s>\\/]+/i,inside:{punctuation:/^<\\/?/,namespace:/^[^\\s>\\/:]+:/}},"attr-value":{pattern:/=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+)/i,inside:{punctuation:[/^=/,{pattern:/^(\\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\\/?>/,"attr-name":{pattern:/[^\\s>\\/]+/,inside:{namespace:/^[^\\s>\\/:]+:/}}}},entity:/&#?[\\da-z]{1,8};/i},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,e){var s={};s["language-"+e]={pattern:/(^<!\\[CDATA\\[)[\\s\\S]+?(?=\\]\\]>$)/i,lookbehind:!0,inside:Prism.languages[e]},s.cdata=/^<!\\[CDATA\\[|\\]\\]>$/i;var n={"included-cdata":{pattern:/<!\\[CDATA\\[[\\s\\S]*?\\]\\]>/i,inside:s}};n["language-"+e]={pattern:/[\\s\\S]+/,inside:Prism.languages[e]};var t={};t[a]={pattern:RegExp("(<__[\\\\s\\\\S]*?>)(?:<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>\\\\s*|[\\\\s\\\\S])*?(?=<\\\\/__>)".replace(/__/g,function(){return a}),"i"),lookbehind:!0,greedy:!0,inside:n},Prism.languages.insertBefore("markup","cdata",t)}}),Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup;
`,
	});

	return files;
}

module.exports = exports = {
	generateDocsFile,
	generateIndexFile,
	generateDocsAssets,
};
