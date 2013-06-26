var assert = require('assert');
var restify = require('restify');
var readline = require('readline');
var fs = require('fs');
var dtp = require('dtrace-provider').createDTraceProvider('echofile');

var client = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '~1.0'
});

new Error().stack;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Filename starting with "/"> ');
rl.prompt();

process.nextTick(function echofile() {
    rl.on('line', function(answer) {
	client.get(answer, function (err, req, res, obj) {
	    if (err)
		console.log(err);
	    else
		console.log(obj);
	    rl.prompt();
	});

    }).on('close', function() {
	console.log('Done');
	process.exit(0);
    }
	 );})

