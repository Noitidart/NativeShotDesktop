const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');

utils.deleteFolderRecursive('./dist/web');

try {
    utils.writeFile('node_modules/cmn/package.json', utils.readFile('node_modules/cmn/package.json').replace('"main": "lib/cmn.js"', '"main": "lib/cmn.min.js"'));
} catch(ignore) {}

module.exports = function (env) {
    return {
        devtool: 'cheap-module-source-map',
        entry: ['./src/web/index.js'],
        output: {
            path: path.join(__dirname, '../dist/web'),
            filename: 'index.bundle.js',
            publicPath: '/static/'
        },
        resolve: {
            extensions: ['.js']
        },
        module: {
            loaders: [
                { test:/\.js$/, exclude:/node_modules/, loader:'string-replace-loader?search=^.*?console\.[a-zA-Z].*?$&flags=gm&replace=', enforce:'pre' },
                { test:/\.css$/, exclude:/node_modules/, use:['style-loader', 'css-loader'] },
                { test:/\.js$/, exclude:/node_modules/, loader:'babel-loader' }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                { from:'./src/web' }
            ], {
                ignore: ['*.js', '*.css']
            })
        ]
    }
}