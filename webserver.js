const http = require("http");
const fs = require("fs");

function createWebServer(opts) {
  const requestListener = (req, res) => {
    console.log(req.method, req.url);
    if (req.url == "/favicon.ico") {
      res.writeHead(200);
      res.end();
    } else if (req.url == "/client.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      const stream = fs.createReadStream("client.js");
      stream.pipe(res);
    } else {
      res.writeHead(200);
      res.write(
        '<html><head><script src="/client.js"></script></head><body></body></html>'
      );
      res.end();
    }
  };

  const server = http.createServer(requestListener);
  return server;
}

module.exports = { createWebServer };
