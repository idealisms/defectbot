const fs = require("fs");
const http = require("http");
const scramjet = require("scramjet");

function createWebServer(opts, soundFilenames) {
  const requestListener = (req, res) => {
    console.log(req.method, req.url);
    if (req.method != "GET") {
      return;
    }

    if (req.url == "/favicon.ico") {
      res.writeHead(200).end();
    } else if (req.url == "/client.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      fs.createReadStream("client.js")
        .pipe(new scramjet.StringStream())
        .lines()
        .parse((line) =>
          line.replace("PORT", opts.port).replace("HOSTNAME", opts.hostname)
        )
        .join("\n")
        .pipe(res);
    } else if (req.url.startsWith("/sounds/")) {
      const soundFilename = req.url.split("/", 3)[2];
      if (soundFilenames.has(soundFilename)) {
        res.writeHead(200, {
          "Content-Type": `audio/${
            soundFilename.toLowerCase().endsWith("wav") ? "wav" : "mpeg"
          }`,
        });
        fs.createReadStream(`sounds/${soundFilename}`).pipe(res);
      } else {
        res.writeHead(404).end();
      }
    } else {
      res.writeHead(200);
      fs.createReadStream("client.html").pipe(res);
    }
  };

  const server = http.createServer(requestListener);
  return server;
}

module.exports = { createWebServer };
