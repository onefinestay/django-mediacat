"use strict";
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  cache: true,
  entry: {
    widget: './static/js/widget',
    library: './static/js/library'
  },
  output: {
    path: 'mediacat/static/mediacat/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?stage=1&optional[]=runtime&optional[]=spec.protoToAssign'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?stage=1&optional[]=runtime&optional[]=spec.protoToAssign'
        ]
      },
      {
        test: /\.woff$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.ttf$/,
        loader: "file-loader?name=[name].[ext]?[hash]"
      },
      {
        test: /\.eot$/,
        loader: "file-loader?name=[name].[ext]?[hash]"
      },
      {
        test: /\.svg$/,
        loader: "file-loader?name=[name].[ext]?[hash]"
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          ExtractTextPlugin.loader({remove: true}),
          'css-loader?sourceMap',
          'postcss-loader',
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  postcss: [
    require('postcss-import')({path: ['./static/css']}),
    require('postcss-custom-properties')(),
    require('postcss-color-function')(),
    require('postcss-nested')(),
    require('autoprefixer-core')(),
    require('cssnano')(),
    require('postcss-bem-linter')(),
    require('postcss-log-warnings')()
  ]
};
