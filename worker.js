const { Worker, isMainThread } = require('worker_threads');

const worker = (() => {

	console.log('worker.js > triggered');

	console.log('worker.js > isMainThread:', isMainThread);

	new Promise((resolve, reject) => {

		const worker = new Worker('./thread.js', {
			// data
		});

		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', code => {
			if (code !== 0) {
				reject(new Error(`Worker stopped with exit code ${code}`));
			}
		});

	}).then((output) => {

		console.log('worker.js > worker output:', output);

	});

});

Array.from(Array(12)).forEach(() => {
	return worker();
});

// exports.worker = worker;
