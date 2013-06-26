	new Error().stack;
    var restify = require('restify');

    var server = restify.createServer({
      name: 'myapp',
      version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/echo/:name', function (req, res, next) {
      res.send(req.params);
      return next();
    });

    server.listen(3000, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
