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
app.get('/libris-sdk/proof', function(req, res) {
  var result = {
    'the proof': 'is in the pudding'
  };
  res.json(result);
});

app.get('/call-center/patient', isAuthorized, function(req, res) {
  if (req.query.imei) {
    //search record by IMEI	...
    var result = {
      'display_name': 'Mr. John Doe',
      'first_name': 'John',
      'last_name': 'Doe',
      'display_address': '9764 Jeopardy Lane, Chicago, IL 60699, USA',
      'dob': '1970-01-01',
      'gender': 'male',
      'title': 'Mr.',
      'address1': '9764 Jeopardy Lane',
      'address2': '',
      'state': 'IL',
      'city': 'Chicago',
      'zipcode': '60699',
      'note': req.query.imei
    }
    res.json(result);
  } else if (req.query.callerid) {
    //search record by callerid	...
    var result = {
      'display_name': 'Mrs. Joe Doe',
      'first_name': 'Joe',
      'last_name': 'Doe',
      'display_address': '9764 Jeopardy Lane, Chicago, IL 60699, USA',
      'dob': '1970-01-01',
      'gender': 'female',
      'title': 'Mrs.',
      'address1': '9764 Jeopardy Lane',
      'address2': '',
      'state': 'IL',
      'city': 'Chicago',
      'zipcode': '60699',
      'note': req.query.callerid
    }
    res.json(result);
  } else {
    res.send(404);
  }
});

//Heroku dynamically assigns your app a port, so you can't set the port to a fixed number. 
//Heroku adds the port to the env, so you can pull it from there. 
var local_port = config.get('server-port');
var port = Number(process.env.PORT || local_port);

logger.info("Server listening locally on ports %s", port);

app.listen(port, function() {
  console.log("Listening on " + port);
});


function isAuthorized(req, res, next) {
  logger.trace("check is authenticated");
  //check a cookie value..., assume for this demo that they have access.
  var hasPermission = true;

  if (!hasPermission) {
    return res.send(403);
  }
  logger.trace("Authorized request");
  return next();
};