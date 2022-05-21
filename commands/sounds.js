class Sounds {
  constructor(client, soundFilesMap, webSocketServer) {
    this.client = client;
    this.soundFilesMap = soundFilesMap;
    this.webSocketServer = webSocketServer;
  }

  handle(channel, tags, commandName, commandInput) {
    if (commandName === "!listsounds") {
      this.client.say(
        channel,
        "I know the following sounds: https://raw.githubusercontent.com/idealisms/defectbot/main/sounds/list%20of%20animal%20sounds.txt"
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
