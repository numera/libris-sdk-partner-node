var log4js = require('log4js');
var express = require('express');
var config = require('nconf');
var logger = log4js.getLogger('Partner Node Server');

//setup the configuration file
config.argv().env();
config.add('default', {
  type: 'file',
  file: './configuration/settings.json'
});

log4js.configure(config.get('log4js'));
log4js.setGlobalLogLevel(config.get('log4js').root_level);

var app = express();
app.use(log4js.connectLogger(logger, {
  level: 'auto'
}));

app.get('/', function(req, res) {
  res.send('hi');
});

//available for authorized and non-authorized requests.
app.get('/libris_sdk/proof', function(req, res) {
  var result = {
    'proof': 'is in the pudding'
  };
  res.json(result);
});


var ports = config.get('server-ports');
logger.info("Server listening on ports %s", ports);

for (var i = ports.length - 1; i >= 0; i--) {
  var port = ports[i];
  logger.debug("start listening on port", port);
  app.listen(port, function() {
    logger.debug("Listening on " + port);
  });
}