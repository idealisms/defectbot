const secrets = require("secrets"); // Populates process.env from .env.
const chatbot = require("./chatbot");
const http = require("http");
const fs = require("fs");

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

const defectbot = chatbot.createChatbot(opts);
defectbot.connect();

const host = "localhost";
const port = 8555;

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
server.listen(port, host, () => {
  console.log(`Http server is running on http://${host}:${port}`);
});
