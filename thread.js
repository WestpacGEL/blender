const { parentPort, workerData, isMainThread } = require('worker_threads');

const thread = async() => {

	console.log('thread.js > isMainThread:', isMainThread);

	// console.log('thread.js > workerData', workerData);

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
		only: [
			__dirname + '/../GEL/components/alert/blender/recipe.js'
		]
	});

	const recipe = require(__dirname + '/../GEL/components/alert/blender/recipe.js');

	console.log('thread.js > require:', recipe);

	parentPort.postMessage({ code: 0 });

};

return thread();

// exports.thread = thread;
