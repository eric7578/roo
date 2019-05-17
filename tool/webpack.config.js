const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestTemplatePlugin = require('./ManifestTemplatePlugin');

const SRC = path.resolve(__dirname, '../src');
const BUILD = path.resolve(__dirname, '../build');

module.exports = {
  entry: path.join(SRC, 'main.js'),
  output: {
    path: BUILD,
    filename: 'main.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(SRC, 'background'),
        to: path.resolve(BUILD, 'background')
      }
    ]),
    new ManifestTemplatePlugin({
      manifest: path.join(__dirname, '../manifest.json'),
      output: BUILD,
      backgroundScripts: path.join(BUILD, 'background/*.js'),
      contentScripts: path.join(BUILD, '*.js')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-react-loader'
        }
      }
    ]
  }
};
