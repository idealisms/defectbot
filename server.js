const fs = require("fs");
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

const soundFilenames = new Set(
  fs
    .readdirSync("./sounds")
    .filter(
      (filename) =>
        filename.toLowerCase().endsWith(".wav") ||
        filename.toLowerCase().endsWith(".mp3")
    )
);

// Map command names to the sound file name.
const soundFilesMap = new Map();
for (const filename of soundFilenames) {
  soundFilesMap.set(
    filename.substr(0, filename.length - 4).toLowerCase(),
    `/sounds/${filename}`
  );
}

const webServer = webserver.createWebServer(opts, soundFilenames);
webServer.listen(opts.port, opts.hostname, () => {
  console.log(`HTTP server is running on http://${opts.hostname}:${opts.port}`);
});

const webSocketServer = websocketserver.createWebSocketServer(opts, webServer);

const defectbot = chatbot.createChatbot(opts, webSocketServer, soundFilesMap);
defectbot.connect();
