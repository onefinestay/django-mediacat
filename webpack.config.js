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
        test: /\.js$/, 
        loaders: ['jsx?harmony&sourceMap=true']
      },    
      {
        test: /\.jsx$/, 
        loaders: ['jsx?harmony&sourceMap=true']
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
        test: /\.scss$/,
        loaders: [
          'style-loader',
          ExtractTextPlugin.loader({remove:true}),
          'css-loader?sourceMap=true',
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