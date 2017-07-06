/**
 * Created by noodles on 06/07/2017.
 * description
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isDebug = !process.argv.includes('--release');
const staticAssetName = isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]';

module.exports = {
  devtool: "cheap-eval-source-map",
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom'],
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),  //  path: 'dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 1024 * 20, // 20kb
            },
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 1024 * 20, // 20kb
            },
          }
        ],
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader',
        ],
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
        },
      },
    ],
  },

  plugins: [
    /* https://github.com/jantimon/html-webpack-plugin */
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: './favicon.ico',
    }),
    /* https://github.com/danethurber/webpack-manifest-plugin */
    new ManifestPlugin(),
  ],
};