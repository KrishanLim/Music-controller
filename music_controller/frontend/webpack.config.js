const path = require('path');

module.exports = {
    target: "web",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './static/frontend'),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                    loader: "babel-loader",
                    options: {
                    sourceType: "unambiguous"
                    }
                }
            }
        ],
    },
};