const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.config.js'), {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});
