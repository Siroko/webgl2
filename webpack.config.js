var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/less/main.less',
    './src/js/app',
    'webpack-dev-server/client?http://0.0.0.0:3000'
  ],
  output: {
      publicPath: '/',
      filename: 'app.js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      { 
        test: /\.js$/,
        include: [
            path.join(__dirname, 'src/js')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.less$/,
        loader: "style!css!autoprefixer!less"
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ]
  },
  devTool: 'cheap-eval-source-map',
  devServer: {
    contentBase: "./public"
  }
};
