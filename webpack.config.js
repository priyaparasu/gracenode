module.exports = {
	entry: "./server/server.js",
	output: {
        path: __dirname+"/build",
		filename: "build/server.js"
	},
	module: {
        preLoaders: [
            {
               test: /\.jsx?$/,
               loaders: ['eslint'],
            }
        ],
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
		  { test: /\.hbs/, exclude: /node_modules/, loader: "handlebars-template-loader" }

		]
	}
};
