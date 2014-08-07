module.exports = function(app) {
  //note the order of this is not random, I want to serve static files before trying to resolve the api routes.
  require('./static')(app);
  require('./libris-sdk')(app);
  require('./call-center')(app);
};