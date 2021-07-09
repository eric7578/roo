const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestTemplatePlugin = require('./tool/ManifestTemplatePlugin');
const webpack = require('webpack');

const SRC = path.resolve(__dirname, 'src');
const BUILD = path.resolve(__dirname, 'build');

function getAvailableBackends() {
  const backendDir = path.join(__dirname, 'src', 'backends');
  const backendDirs = fs.readdirSync(backendDir).filter(dir => {
    const index = path.join(backendDir, dir, 'index.js');
    return fs.existsSync(index);
  });
  return backendDirs;
}

module.exports = (env, argv) => {
  const isProd = env && env.production;

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval-source-map',
    entry: path.join(SRC, 'main.js'),
    output: {
      path: BUILD,
      filename: 'main.js'
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        BACKENDS: getAvailableBackends()
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(SRC, 'background'),
            to: path.resolve(BUILD, 'background')
          }
        ]
      }),
      new ManifestTemplatePlugin({
        manifest: path.join(__dirname, 'manifest.json'),
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
          use: ['@svgr/webpack']
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.woff2?$/,
          use: {
            loader: 'url-loader'
          }
        }
      ]
    }
  };
};
