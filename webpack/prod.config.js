const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'babel-polyfill',
        path.join(__dirname, '../client/src/index'),
        '../client/src/styles/index.scss'
    ],
    output: {
        path: path.join(__dirname, '../public/'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: [path.resolve(__dirname, "node_modules")],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','sass-loader']
                })
            },
        ],
        loaders: [
            {test: /\.svg$/, loaders: ['raw-loader']},
            // take all scss files, compile them, and bundle them in with our js bundle
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        new ExtractTextPlugin({
            filename: '../public/[name].bundle.css',
            disable: false,
            allChunks: true,}),
        new HtmlWebpackPlugin({
            title: 'Extract Text Webpack Plugin',
            filename: 'auto-generator.html',
            template: './index.html',
            minify: false
        }),
    ],
};
