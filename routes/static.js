'use strict';

var express = require('express');
var log4js = require('log4js');
var logger = log4js.getLogger('Static files');

module.exports = function(app) {
  //make sure that the index.html file will not be cached.
  app.use(function noCachePlease(req, res, next) {
    if (req.url === '/') {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
    }
    next();
  });

  //output of Angular file is placed in the following folder.
  if (process.env.NODE_ENV === 'production') {
    logger.info('Using static files from client/bin directory');
    app.use(express.static(__dirname + '/../client/bin'));
  } else {
    logger.info('Using static files from client/build directory');
    app.use(express.static(__dirname + '/../client/build'));
  }
  //I don't servce this
  app.get('/favicon.ico', function(req, res) {
    res.send(404);
  });
};