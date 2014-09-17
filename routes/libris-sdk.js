'use strict';

var crypto = require('crypto');
var log4js = require('log4js');
var logger = log4js.getLogger('Static files');


module.exports = function(app) {
  //temporary. 
  app.get('/', function(req, res) {
    res.send('you should not see this, the index.html page is served as a static route');
  });

  var computeSignature = function(key, message) {
    logger.debug('computing proof for %s', message);
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('base64');
  };

  app.get('/libris-sdk/proof', function(req, res) {
    var appId = process.env.LIBRIS_APP_ID;
    var appKey = process.env.LIBRIS_APP_KEY;
    logger.debug('AppId %s', appId);
    var nonce = Math.floor(new Date().getTime() / 1000);
    var toSign = appId + nonce;
    var result = computeSignature(appKey, toSign);
    logger.debug('computed proof %s', result);
    var jsonResult = {
      'proof': result
    };
    res.json(jsonResult);
  });

  app.get('/libris_sdk/proof_simulator', function(req, res) {
    logger.debug('req', req.query);
    var result = computeSignature(req.query.key, req.query.toSign);
    logger.debug('computed proof demo: %s', result);
    var jsonResult = {
      'proof': result
    };
    res.json(jsonResult);
  });

};