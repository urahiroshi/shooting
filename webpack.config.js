const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist_client'),
        filename: 'main.js',
        publicPath: '/dist_client',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
        ],
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
    ],
};