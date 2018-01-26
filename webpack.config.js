const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = true;

const HOST = 'localhost';
const PORT = 8081;

module.exports = {
  entry: isDev ? './demo/index.js' : './src/index.js',
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
            options: { limit: Infinity },
          },
        ],
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      // chunks: ['index'],
      template: path.join(__dirname, 'demo/index.html'),
    }),
  ],
};
