const tmi = require("tmi.js");
const commands = require("./commands");

function createChatbot(opts, webSocketServer, soundFilesMap) {
  // Create a client with our options
  const client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on("message", onMessageHandler);
  client.on("connected", onConnectedHandler);

  const sendToWebSocketClients = (messageObject) => {
    for (const connection of webSocketServer.connections) {
      connection.sendUTF(JSON.stringify(messageObject));
    }
  };

  const messageHandlers = [
    new commands.Dice(client),
    new commands.Calc(client),
    new commands.Sounds(client, soundFilesMap, webSocketServer),
  ];

  // Called every time a message comes in
  function onMessageHandler(channel, tags, msg, isSelf) {
    if (isSelf || !msg.startsWith("!")) {
      return;
    }

    const commandName = msg.split(" ", 1)[0];
    const commandInput = msg.slice(commandName.length + 1);
    const say = (txt) => client.say(channel, txt);
    const isModOrBroadcaster = (tags) => tags.mod || tags.badges.broadcaster;

    var handled = false;
    for (const handler of messageHandlers) {
      handled = handler.handle(channel, tags, commandName, commandInput);
      if (handled) {
        break;
      }
    }
    if (!handled) {
      // Remove this after everything is transitioned to a message handler.
      if (commandName == "!newgame" && isModOrBroadcaster(tags)) {
        sendToWebSocketClients({
          cmd: "newgame",
          name: channel.slice(1),
        });
        say("A new game is starting. Type !in to join the game.");
      } else if (commandName == "!cleargame" && isModOrBroadcaster(tags)) {
        sendToWebSocketClients({
          cmd: "cleargame",
        });
      } else if (
        ["!removename", "!removeplayer"].indexOf(commandName) != -1 &&
        isModOrBroadcaster(tags)
      ) {
        var name = commandInput.trim();
        if (name.startsWith("@")) {
          name = name.substr(1);
        }
        sendToWebSocketClients({
          cmd: "removeplayer",
          name,
        });
      } else if (commandName == "!in") {
        sendToWebSocketClients({
          cmd: "addplayer",
          name: tags["display-name"],
        });
      } else {
        console.log(`* Unknown command ${commandName}`);
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    client.say(process.env.CHANNEL_NAME, "I am online.");
  }

  return client;
}

module.exports = { createChatbot };
