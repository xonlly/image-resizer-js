const path = require('path');

const CI = !!process.env.CI;

const webpackConfig = {
  devtool: 'inline-source-map',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    autoWatch: true,
    browsers: CI ? ['Chrome'] : ['Chrome', 'Firefox', 'Safari'],
    files: [
      { pattern: 'tests/*.js', watched: true, served: true, included: true },
      {
        pattern: 'src/*.js',
        watched: true,
        served: false,
        included: false,
        nocache: false,
      },
    ],
    preprocessors: {
      './tests/*.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
  });
};
