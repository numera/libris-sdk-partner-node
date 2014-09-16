'use strict';

var crypto = require('crypto');
var log4js = require('log4js');
var logger = log4js.getLogger('Static files');


module.exports = function(app) {
  //temporary. 
  app.get('/', function(req, res) {
    res.send('you should not see this, the index.html page is served as a static route');
  });

  //available for authorized and non-authorized requests.
  app.get('/libris-sdk/proof', function(req, res) {
    var result = {
      'the proof': 'is in the pudding'
    };
    res.json(result);
  });

  app.get('/libris_sdk/proof_simulator', function(req, res) {
    logger.debug('req', req.query);
    var hmac = crypto.createHmac('sha256', req.query.key);
    hmac.update(req.query.toSign);
    var result = hmac.digest('base64');
    logger.debug('proof result = %s', result);
    res.json(result);
  });

};