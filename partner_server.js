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

//Heroku dynamically assigns your app a port, so you can't set the port to a fixed number. 
//Heroku adds the port to the env, so you can pull it from there. 
var local_port = config.get('server-port');
var port = Number(process.env.PORT || local_port);

logger.info("Server listening locally on ports %s", port);

app.listen(port, function() {
  console.log("Listening on " + port);
});