/**
 * All functions to generate docs files
 *
 * generateDocsFile  - TODO
 * generateIndexFile - TODO
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
</head>
<body>
	<h1>GEL BLEND</h1>

	<ul>
		${docs
			.map((doc) => `<li><a href="${doc.path.replace('/docs/', '')}">${doc.name}</a></li>`)
			.join('\n')}
	</ul>
</body>
</html>
`;
}

module.exports = exports = {
	generateDocsFile,
	generateIndexFile,
};
