/*
 * Copyright 2013 Joyent, Inc.  All rights reserved.
 *
 */

var p = console.log;
var util = require('util'),
    format = util.format;
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var once = require('once');
var restify = require('restify');
var errors = require('./errors');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

function storeFileFromFile(srcstream, dstfile, callback) {
	/* remove the destination path and recreate it */
        rimraf("tmp", function (err2) {
            if (err2) {
                return callback(err2);
            }

	    mkdirp("tmp", function (err) {
		if (err) {
		    return callback(err);
		}
		var toStream = fs.createWriteStream("tmp/"+dstfile);

		toStream.on('close', function () {
		    return callback();
		});
		
		toStream.on('error', function (err3) {
		    return callback(err3);
		});
		
		srcstream.pipe(toStream);
		srcstream.resume();  // Let copyFile run
		
	    });
	    
	});
}


function copyFile(srcfile, dstfile) {
    var md5sum = crypto.createHash('md5');
    var stream = fs.createReadStream(srcfile);

    stream.pause();  // wait for resume
    stream.on('data', function (chunk) {
	md5sum.update(chunk);
    });
    stream.on('end', function () {
//	console.log('stream "end" event');
    });
    stream.on('close', function () {
//	console.log('stream "close" event');
    });

    function finish_(err) {
//	console.log('finish_ ' + err);
	if (err) {
	    return err;
	}

	var file = {
	    mtime: (new Date()).toISOString(),
	};

	file.contentMD5 = md5sum.digest('hex');
        file.mtime = (new Date()).toISOString();
	console.log("tmp/"+ dstfile + " md5sum = " + file.contentMD5);

    }
    var finish = once(finish_);
    
    storeFileFromFile(stream, dstfile,
			   function (sErr) {
			       if (sErr) {
				   finish(errors.parseErrorFromStorage(
				       sErr, 'error receiving image file'));
			       } else {
				   finish();
			       }
			   });
}


copyFile("words", "words.save");
