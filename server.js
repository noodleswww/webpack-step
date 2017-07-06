var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var app = express();
var compiler = webpack(webpackConfig);

// https://github.com/webpack/webpack-dev-middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/', // 大部分情况下和 `output.publicPath`相同
  // quiet: true,
  watchOptions: {},
}));

// https://github.com/glenjamin/webpack-hot-middleware
app.use(webpackHotMiddleware(compiler, { log: false }));

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});