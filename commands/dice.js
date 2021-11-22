class Dice {
  constructor(client) {
    this.client = client;
  }

  handle(channel, tags, commandName, commandInput) {
    if (commandName !== "!dice") {
      return false;
    }
    const sides = 6;
    const num = Math.floor(Math.random() * sides) + 1;
    this.client.say(channel, `You rolled a ${num}.`);
    return true;
  }
}

module.exports = Dice;
