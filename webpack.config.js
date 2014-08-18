var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    library: './static/js/library'
  },
  output: {
    path: 'mediacat/static/mediacat/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loaders: ['jsx?harmony']
      },    
      {
        test: /\.jsx$/, loaders: ['jsx?harmony']
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          ExtractTextPlugin.loader({remove:true}),
          'css-loader',
          'autoprefixer-loader',
          'sass-loader?precision=10&outputStyle=expanded&sourceMap=true',
        ]
      }      
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  cache: true
};