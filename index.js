const tmi = require("tmi.js");
const secrets = require("secrets");
const commands = require("./commands");

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch IRC.
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, tags, msg, isSelf) {
  if (isSelf || !msg.startsWith("!")) {
    return;
  }

  const commandName = msg.split(" ", 1)[0];
  const commandInput = msg.slice(commandName.length + 1);
  const say = (txt) => client.say(channel, txt);

  // If the command is known, let's execute it
  if (commandName === "!dice") {
    commands.dice(commandInput, say);
  } else if (commandName === "!calc") {
    commands.calc(commandInput, say);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  client.say(process.env.CHANNEL_NAME, "I am online.");
}
