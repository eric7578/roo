const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.config.js'), {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
