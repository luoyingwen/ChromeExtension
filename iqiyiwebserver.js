var http = require('http');
var url = require('url');
var PORT = 8080;
var BINDIP = '0.0.0.0';
var iqiyivideos = [];
http.createServer(function (req, res) {
    var urlinfo = url.parse(req.url, true);
    var actionresult = 'unknown action';
    console.log(urlinfo.pathname);
    console.log(urlinfo.query);
    if (urlinfo.pathname === '/iqiyi/video/url/insert') {
        actionresult = 'insert successfully';
        var metadatareq = http.request(urlinfo.query.url, function (res) {
            console.log('request video url');
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(chunk);
            });
        });
        metadatareq.end();
        
        iqiyivideos.push(urlinfo.query);
    }
    else if (urlinfo.pathname === '/iqiyi/video/url/delete') {
        actionresult = 'delete successfully';
        var video = {};
        video.count = 0;
        if (iqiyivideos.length > 0) {
            video.count = 1;
            video.info = iqiyivideos.pop();
        }
        actionresult = JSON.stringify(video);
        console.log(actionresult);
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end(actionresult);
}).listen(PORT, BINDIP);
console.log('Server running at http://' + BINDIP + ':' + PORT);