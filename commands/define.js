const wd = require("word-definition");

class Define {
  constructor(client) {
    this.client = client;
  }
  
  handle(channel, tags, commandName, commandInput) {
    if (commandName !== "!define") {
      return false;
    }

    const word = commandInput.trim();
    wd.getDef(word, "en", null, (definition) => {
      if (definition.err === 'not found') {
        this.client.say(channel, `"${word}" not found.`);
      } else if (definition.definition) {
        this.client.say(channel, `${word}: ${definition.definition}`);
      }
    });

    return true;
  }
}  

module.exports = Define;
  