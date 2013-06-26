var restify = require('restify');
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());

server.use(function slowHandler(req, res, next) {
    process.stdout.write("slowHandler\n");
  setTimeout(function() { return next(); }, 2513);
});

server.get('/hello/:name', function echo(req, res, next) {
  res.send({
    hello: req.params.name
  });
});

server.listen(8080);
