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

//very basic http authentication. Only to be used under https (and local intranet)
function isAuthorized(req, res, next) {
  logger.trace("check is authenticated");

  var auth = req.headers['authorization'];
  if (!auth) {
    // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
    // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Patient Sensitive Data"');
    res.end('<html><body>I need you credentials. User: demo, Password: omed </body></html>');
  } else {
    var tmp = auth.split(' '); // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    var plain_auth = buf.toString(); // read it back out as a string

    logger.trace("Decoded Authorization ", plain_auth);

    // At this point plain_auth = "username:password"

    var creds = plain_auth.split(':'); // split on a ':'
    var username = creds[0];
    var password = creds[1];

    if ((username === 'demo') && (password === 'omed')) { // Is the username/password correct?
      return next();
    } else {
      res.statusCode = 401; // Force them to retry authentication
      res.setHeader('WWW-Authenticate', 'Basic realm="Patient Sensitive Data"');
      res.end('<html><body>Just reverse your username demo as password.</body></html>');
    }
  }
}

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
  var result;
  if (req.query.imei) {
    //search record by IMEI	...
    result = {
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
    };
    res.json(result);
  } else if (req.query.callerid) {
    //search record by callerid	...
    result = {
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
    };
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