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

server.get('/clean', function(req, res, next) {
  gcmClients = [];
  res.send(gcmClients);
  return next();
});


var sender = new gcm.Sender('insert Google Server API Key here');
server.get('/broadcast/:message', function(req, res, next) {
  var message = new gcm.Message();
  message.addDataWithKeyValue('message',req.params.message);
  sender.send(message, gcmClients, 4, function(err, result) {
    console.log(result);
  });
  return next();
});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});