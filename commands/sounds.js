class Sounds {
  constructor(client, soundFilesMap, webSocketServer) {
    this.client = client;
    this.soundFilesMap = soundFilesMap;
    this.webSocketServer = webSocketServer;

    this.commandsArray = Array.from(soundFilesMap.keys())
      .sort()
      .map((commandName) => `!${commandName}`);
  }

  handle(channel, tags, commandName, commandInput) {
    if (commandName === "!listsounds") {
      this.client.say(
        channel,
        "Use !listsounds1 and !listsounds2 to see a list of Super Auto Pets sounds I know."
      );
      return true;
    }
    if (commandName === "!listsounds1") {
      this.client.say(
        channel,
        `I know the following sounds: ${this.commandsArray
          .slice(0, this.commandsArray.length / 2)
          .join(" ")}`
      );
      return true;
    }
    if (commandName === "!listsounds2") {
      this.client.say(
        channel,
        `I know the following sounds: ${this.commandsArray
          .slice(this.commandsArray.length / 2)
          .join(" ")}`
      );
      return true;
    }

    if (this.soundFilesMap.has(commandName.substr(1).toLowerCase())) {
      // TODO: Rather than sending to all clients, only send it to the
      // client for this channel.
      for (const connection of this.webSocketServer.connections) {
        connection.sendUTF(
          JSON.stringify({
            cmd: "play",
            filename: this.soundFilesMap.get(
              commandName.substr(1).toLowerCase()
            ),
          })
        );
      }
      return true;
    }

    return false;
  }
}

module.exports = Sounds;
