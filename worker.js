const { parentPort, workerData } = require('worker_threads');
const path = require('path');

function doSomethingForALongTime() {
	console.log('worker.js > initial data:', workerData);

	const recipe = path.normalize(`${__dirname}/../GUI3/components/alert/blender/recipe.js`);
	require('@babel/register')({
		presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
		plugins: [
			require.resolve('@babel/plugin-transform-runtime'),
			[
				require.resolve('@babel/plugin-syntax-dynamic-import'),
				{
					root: process.cwd,
					suppressResolveWarning: true,
				},
			],
		],
		only: [recipe],
	});

	require(recipe);

	parentPort.postMessage('finished' /**/);
}

doSomethingForALongTime();
