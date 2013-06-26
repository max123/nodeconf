new Error().stack;
var restify = require('restify');
var fs = require('fs');
var dtp = require('dtrace-provider').createDTraceProvider('echofile-server');

dtp.addProbe('echo-start', 'char *');
dtp.addProbe('echo-done', 'char *', 'int');
dtp.addProbe('echo-error', 'char *', 'char *');

dtp.enable();

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/^\/(.*)/, function sget(req, res, next) {

    dtp.fire('echo-start', function() {
	return [req.params[0]];
    });

/*    fs.stat(req.params[0].substring(req.params[0].lastIndexOf('/')+1), function(err, stats) { */
    fs.stat(req.params[0], function(err, stats) {
	if (!err && stats) {
	    var len = stats.size;

	    if (stats.isDirectory()) {
		console.log(req.params[0] + ' is a directory');
		fs.readdir(req.params[0], function (err, filenames) {
		    var i;
		    if (!err) {
			for (i = 0; i < filenames.length; i++) {
			    res.write(filenames[i] + '\n');
			}
			res.end();
		    }
		});
		dtp.fire('echo-done', function() {
		    return [req.params[0], len];
		});

	    } else if (stats.isFile()) {
		console.log(req.params[0] + 'is a file');
		var readstream = fs.createReadStream(req.params[0]);
		readstream.on('open', function() {
		    readstream.pipe(res);
		});
		readstream.on('error', function(e) {
		    dtp.fire('echo-error', function() {
			return [req.params[0], JSON.stringify(e)];
		    });
		    res.send(e.toString());
		});

		dtp.fire('echo-done', function() {
		    return [req.params[0], len];
		});
	    } else {
		res.send(req.params[0], ' is not a regular file or directory');
	    }
	} else {
	    dtp.fire('echo-error', function() {
		return [req.params[0], JSON.stringify(err)];
	    });
	    res.send(err.toString());
	}
    });
    return next();
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});
