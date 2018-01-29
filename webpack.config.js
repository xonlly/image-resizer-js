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
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: isProd ? undefined : `http://${HOST}:${PORT}/`,
  },
  module: {
    rules: [
      !isProd && {
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
    ].filter(Boolean),
  },
  plugins: [
    !isProd && new webpack.HotModuleReplacementPlugin(),
    !isProd &&
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
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
