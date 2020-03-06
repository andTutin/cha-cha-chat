const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 
const conf = {
    entry: './src/js/chat.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename : 'chat.js',
        publicPath: 'dist/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.pug'
        }),
        new MiniCssExtractPlugin({
            filename: 'chat.css',
        })
    ]
}
 
module.exports = conf;