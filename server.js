const secrets = require("secrets"); // Populates process.env from .env.
const chatbot = require("./chatbot");
const webserver = require("./webserver");
const websocketserver = require("./websocketserver");

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
  hostname: process.env.HOSTNAME || "localhost",
  port: Number(process.env.PORT) || 8555,
};

const defectbot = chatbot.createChatbot(opts);
defectbot.connect();

const webServer = webserver.createWebServer(opts);
webServer.listen(opts.port, opts.hostname, () => {
  console.log(`HTTP server is running on http://${opts.hostname}:${opts.port}`);
});

const webSocketServer = websocketserver.createWebSocketServer(opts, webServer);
