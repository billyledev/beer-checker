const http = require('http');
const fs = require('fs');

const host = "192.168.1.12";
const port = 8080;

const httpServer = http.createServer(httpHandler);

httpServer.listen(port, host, () => {
    console.log("Server listening...");
});

function httpHandler(req, res) {
    fs.readFile('./public/' + req.url, function (err, data) {
        if (err == null ) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    });
}
