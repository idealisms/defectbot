const Dice = require("./dice");
const tmi = require("tmi.js");

jest.mock("tmi.js");

test("roll the die", () => {
  const mockClient = new tmi.client();
  const dice = new Dice(mockClient);
  dice.handle("channel", {}, "!dice", "");
  expect(mockClient.say.mock.calls[0][1]).toMatch(/You rolled a [1-6][.]/);
});
