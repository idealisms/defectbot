const http = require("http");
const fs = require("fs");
const scramjet = require("scramjet");

function createWebServer(opts) {
  // A set of all the filenames.
  const soundFilenames = new Set();
  // Map command names to the sound file name.
  const soundFilesMap = new Map();

  fs.readdir("./sounds", (err, files) => {
    for (const filename of files) {
      if (
        filename.toLowerCase().endsWith(".wav") ||
        filename.toLowerCase().endsWith(".mp3")
      ) {
        soundFilenames.add(filename);
        soundFilesMap.set(filename.substr(0, filename.length - 4), filename);
      }
    }
  });

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
      res
        .writeHead(200)
        .write(
          '<html><head><script src="/client.js"></script></head><body></body></html>'
        );
      res.end();
    }
  };

  const server = http.createServer(requestListener);
  return server;
}

module.exports = { createWebServer };
