const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.env.NODE_ENV !== 'development';

console.log('idProd', isProd);

const HOST = 'localhost';
const PORT = 8081;

module.exports = {
  devServer: {
    host: HOST,
    port: PORT,
  },
  entry: isProd ? './src/index.js' : './demo/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: `http://${HOST}:${PORT}/`,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: Infinity, mimetype: 'image/jpg' },
          },
        ],
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    !isProd &&
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        // chunks: ['index'],
        template: path.join(__dirname, 'demo/index.html'),
      }),
    // Minify JS
    isProd &&
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: true,
          mangle: true,
        },
      }),
  ].filter(Boolean),
};
