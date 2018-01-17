const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'babel-polyfill',
        path.join(__dirname, '../client/src/index.js'),
        path.join(__dirname, '../client/src/styles/index.scss'),
    ],
    output: {
        path: path.join(__dirname, '../public/'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                // take all scss files, compile them, and bundle them in with our js bundle
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                })
            },
            {
                // Transform our own .css files with PostCSS and CSS-modules
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                // Do not transform vendor's CSS with CSS-modules
                // The point is that they remain in global scope.
                // Since we require these CSS files in our JS or CSS files,
                // they will be a part of our compilation either way.
                // So, no need for ExtractTextPlugin here.
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'raw-loader',
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        new ExtractTextPlugin({
            filename: '../public/[name].bundle.css',
            disable: false,
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            template: './client/src/index.html',
            filename: '../public/index.html', //relative to root of the application
            minify: false
        }),
    ],
};
