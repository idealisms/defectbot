class CalcDraw {
  constructor(client) {
    this.client = client;
  }

  drawProbability(draw_pile, draw_size, num_target_cards) {
    if (1 == draw_size) {
      return num_target_cards / draw_pile;
    }
    return (
      1 -
      ((draw_pile - num_target_cards) / draw_pile) *
        (1 -
          this.drawProbability(draw_pile - 1, draw_size - 1, num_target_cards))
    );
  }

  inputIsValid(tokens) {
    if (tokens.length != 3) {
      return false;
    }
    for (let token of tokens) {
      if (isNaN(token) || token < 1) {
        return false;
      }
    }
    if (tokens[1] > tokens[0] || tokens[2] > tokens[0]) {
      return false;
    }
    return true;
  }

  handle(channel, tags, commandName, commandInput) {
    if (commandName !== "!calcdraw") {
      return false;
    }
    let tokens = commandInput
      .trim(/\W+/)
      .split(/\W+/)
      .map((n) => parseInt(n, 10));

    if (!this.inputIsValid(tokens)) {
      this.client.say(
        channel,
        "Usage: !calcdraw <draw pile size> <draw size> <number of target cards>"
      );
      return true;
    }
    let prob = this.drawProbability(...tokens);

    this.client.say(
      channel,
      `The chance of of drawing at least one of the ${tokens[2]} target card(s) when drawing ${tokens[1]} card(s) from a draw pile with ${tokens[0]} cards is ${prob}.`
    );
    return true;
  }
}

module.exports = CalcDraw;
