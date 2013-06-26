    var assert = require('assert');
    var restify = require('restify');
    var readline = require('readline');

    var client = restify.createJsonClient({
      url: 'http://localhost:8080',
      version: '~1.0'
    });
new Error().stack;

/*    client.get('/echo/mark', function (err, req, res, obj) {
      assert.ifError(err);
      console.log('Server returned: %j', obj);
    });
*/


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('OHAI> ');
rl.prompt();

process.nextTick(function sendecho() {
    rl.on('line', function(answer) {
	client.get(answer, function (err, req, res, obj) {
	    assert.ifError(err);
	    console.log("Thank you for your valuable feedback:", answer);
	});
	  rl.prompt();
    }).on('close', function() {
	console.log('Done');
	process.exit(0);
    }
	 );})



