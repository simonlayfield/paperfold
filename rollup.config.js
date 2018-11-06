import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';

const rollup = require('rollup');
const watchOptions = {};
const watcher = rollup.watch(watchOptions);

export default {
	input: 'src/main.js',
	output: {
		file: 'public/js/bundle.js',
		format: 'iife'
	},
	plugins: [
		svelte(),
		babel(),
		resolve()
	]
}
