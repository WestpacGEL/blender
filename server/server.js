const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const { blender } = require('../lib/index.js');

const server = express();

server
	.use(express.static('.'))
	.use(bodyParser.urlencoded({ extended: true }))
	.post('/blender', async (req, res) => {
		try {
			const result = await blender({
				cwd: path.normalize(`${__dirname}/../tests/mock/mock-project2/`),
				brand: `@westpac/${req.body.brand}`,
				scope: '',
				// 'output-zip': true,
				include: req.body.packages.map((pkg) => `@westpac/${pkg}`),
			});

			console.log(JSON.stringify(result, null, 2));
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
		}

		res.send('POST request');
	});

server.listen(1337, () => console.log('Server listening at http://localhost:1337'));
