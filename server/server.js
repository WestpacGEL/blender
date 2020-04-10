const bodyParser = require('body-parser');
const archiver = require('archiver');
const express = require('express');
const path = require('path');

const { blender } = require('../lib/index.js');

const server = express();

server
	.use(express.static('.'))
	.use(bodyParser.urlencoded({ extended: true }))
	.post('/blender', async (req, res) => {
		req.body.packages.push('core', `${req.body.brand}`);
		const prefix = 'zip';
		let result;

		try {
			result = await blender({
				cwd: path.normalize(`${__dirname}/../tests/mock/mock-project2/`),
				brand: `@westpac/${req.body.brand}`,
				scope: '',
				output: prefix,
				include: req.body.packages.map((pkg) => `@westpac/${pkg}`),
			});
		} catch (error) {
			res
				.status(500)
				.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
		}

		// create an archiver instance
		const archive = archiver('zip');

		archive
			.on('warning', (error) => {
				// catch warnings
				if (err.code === 'ENOENT') {
					console.error(`Could not find file or directory: ${error}`);
				} else {
					res
						.status(500)
						.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
				}
			})
			.on('error', (error) => {
				// catch errors
				res
					.status(500)
					.send({ error: `The blender failed with an error: ${JSON.stringify(error, null, 2)}` });
			})
			.pipe(res);

		// append each file to the zip
		result.files.map(([_, { name, filePath, dir, content }]) => {
			archive.append(content, { name: `${dir.slice(prefix.length)}/${filePath}/${name}` }, 'utf-8');
		});

		res.writeHead(200, {
			'Content-Type': `application/zip`,
			'Content-disposition': `attachment; filename=GUI-blend-${req.body.brand}.zip`,
		});

		// finish off zip process
		archive.finalize();
	});

server.listen(1337, () => console.log('Server listening at http://localhost:1337'));
