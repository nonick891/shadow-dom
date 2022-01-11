const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'shadow-dom-manager.js',
		library: {
			name: 'shadowDom',
			type: 'umd',
		},
	},
};