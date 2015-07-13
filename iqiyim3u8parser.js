var http = require('http');
var fs = require('fs');
function openAndWriteToSystemLog(writeBuffer, filename, callback){
    fs.open(filename, 'a', function opened(err, fd) {
        if (err) { return callback(err); }
        function notifyError(err) {
            fs.close(fd, function() {
                callback(err);
            });
        }
        var bufferOffset = 0,
        bufferLength = writeBuffer.length,
        filePosition = null;
        fs.write( fd, writeBuffer, bufferOffset, bufferLength, filePosition,
            function wrote(err, written) {
                if (err) { return notifyError(err); }
                fs.close(fd, function() {
                    callback(err);
                });
            }
        );
    });
}
var resfunwithcallonend = function(callonend, param) {
	var body = '';	
	var resfun = function(res) {
		res.on('data',function(d){
			body += d;
		});
		res.on('end', function(){
			console.log(body.length);
			console.log(res.headers);
			if (callonend) {
				callonend(body, param);
			}
		});
	};
	return resfun;
}

var writem3u8 = function (body, filename) {
	console.log(body.length);
	console.log(filename);
	openAndWriteToSystemLog(
		new Buffer(body),
		filename,
		function done(err) {
			if (err) {
				console.log("error while opening and writing:", err.message);
				return;
			}
			console.log('All done with no errors');
		}
	);
}

var retrivem3u8 = function (body, filename) {
	var result = JSON.parse(body);
	var newReq = http.request(result.data.mu, resfunwithcallonend(writem3u8, filename));
	newReq.end();
}

exports.download = function (url, filename) {
	var req = http.request(url, resfunwithcallonend(retrivem3u8, filename)).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	req.end();
}