var restify = require('restify');
var gcm = require('node-gcm');

var server = restify.createServer({
  name: 'gcm-node-server',
  version: '1.0.0'
});

var gcmClients = [];

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/register/:clientId', function(req, res, next) {
  var existed = false;

  for (var i = 0; i < gcmClients.length; i++) {
    if (gcmClients[i] === req.params.clientId) {
      existed = true;
    }
  };

  if (!existed) {
    gcmClients.push(req.params.clientId);
  }

  res.send(gcmClients);
  return next();
});

server.get('/list', function(req, res, next) {
  res.send(gcmClients);
  return next();
});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});