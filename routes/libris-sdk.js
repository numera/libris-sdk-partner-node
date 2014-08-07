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
};