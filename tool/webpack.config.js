const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC = path.resolve(__dirname, '../src');
const BUILD = path.resolve(__dirname, '../build');

module.exports = {
  entry: path.join(SRC, 'main.js'),
  output: {
    path: path.join(BUILD, 'src'),
    filename: 'main.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../manifest.json'),
        to: path.resolve(BUILD, 'manifest.json')
      },
      {
        from: path.resolve(SRC, 'background'),
        to: path.resolve(BUILD, 'background')
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
