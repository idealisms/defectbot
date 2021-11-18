const secrets = require("secrets"); // Populates process.env from .env.
const chatbot = require("./chatbot");
const webserver = require("./webserver");

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
  hostname: process.env.HOSTNAME || "localhost",
  httpport: Number(process.env.HTTPPORT) || 8555,
};

const defectbot = chatbot.createChatbot(opts);
defectbot.connect();

const webhttpserver = webserver.createWebServer(opts);

webhttpserver.listen(opts.httpport, opts.hostname, () => {
  console.log(
    `HTTP server is running on http://${opts.hostname}:${opts.httpport}`
  );
});
