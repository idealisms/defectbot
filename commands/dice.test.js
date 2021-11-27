const Dice = require("./dice");

test("roll the die", () => {
  class MockClient {
    constructor() {
      this.saylog = [];
    }
    say(channel, message) {
      this.saylog.push({ channel, message });
    }
  }

  const mockClient = new MockClient();
  const dice = new Dice(mockClient);
  dice.handle("channel", {}, "!dice", "");
  expect(mockClient.saylog.length).toBe(1);
  expect(mockClient.saylog[0].message).toMatch(/You rolled a [1-6][.]/);
});
