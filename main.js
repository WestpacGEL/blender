const { Worker } = require('worker_threads');

function runWorker2() {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./worker.js', {
			workerData: 'data for worker',
		});

		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', (code) => reject(new Error(`Worker stopped with exit code ${code}`)));
	});
}

const timeout = setInterval(() => console.log('running'), 100);
runWorker2().then((output) => {
	clearTimeout(timeout);
	console.log('main.js > worker output:', output);
});
