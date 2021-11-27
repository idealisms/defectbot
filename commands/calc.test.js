const Calc = require("./calc");

test("tokenize", () => {
  expect(Calc.tokenizeForTest("1+1")).toEqual(["1", "+", "1"]);
  expect(Calc.tokenizeForTest("1 + 1")).toEqual(["1", "+", "1"]);
  expect(Calc.tokenizeForTest("foo")).toEqual([]);
  expect(Calc.tokenizeForTest("System.eval")).toEqual([]);
  expect(Calc.tokenizeForTest("-5")).toEqual(["-5"]);
  expect(Calc.tokenizeForTest("-5.0")).toEqual(["-5.0"]);
  expect(Calc.tokenizeForTest("-5.")).toEqual(["-5."]);
  expect(Calc.tokenizeForTest("-.5")).toEqual(["-.5"]);
  expect(Calc.tokenizeForTest("1+-5")).toEqual(["1", "+", "-5"]);
  expect(Calc.tokenizeForTest("1-5")).toEqual(["1", "-", "5"]);
  expect(Calc.tokenizeForTest("(-5-2)")).toEqual(["(", "-5", "-", "2", ")"]);
  expect(Calc.tokenizeForTest("-5--2")).toEqual(["-5", "-", "-2"]);
  expect(Calc.tokenizeForTest("1..2 ..2 2.2 3..")).toEqual([]);
  expect(Calc.tokenizeForTest("1.0-+1")).toEqual(["1.0", "-", "+", "1"]);
  expect(Calc.tokenizeForTest("(8+1.5 * (4+4+4) )*.75")).toEqual([
    "(",
    "8",
    "+",
    "1.5",
    "*",
    "(",
    "4",
    "+",
    "4",
    "+",
    "4",
    ")",
    ")",
    "*",
    ".75",
  ]);
  expect(Calc.tokenizeForTest("3 + 4 * 2 / ( 1 - 5 )")).toEqual([
    "3",
    "+",
    "4",
    "*",
    "2",
    "/",
    "(",
    "1",
    "-",
    "5",
    ")",
  ]);
});

test("shuntingYard", () => {
  expect(
    Calc.shuntingYardForTest([
      "3",
      "+",
      "4",
      "*",
      "2",
      "/",
      "(",
      "1",
      "-",
      "5",
      ")",
    ])
  ).toEqual([3, 4, 2, "*", 1, 5, "-", "/", "+"]);
});

test("!calc", () => {
  class MockClient {
    constructor() {
      this.saylog = [];
    }
    say(channel, message) {
      this.saylog.push({ channel, message });
    }
    lastSay() {
      return this.saylog[this.saylog.length - 1].message;
    }
  }

  const mockClient = new MockClient();
  const calc = new Calc(mockClient);
  calc.handle("channel", {}, "!calc", "1 + 1");
  expect(mockClient.lastSay()).toBe("2");
  calc.handle("channel", {}, "!calc", "3 + 4 * 2 / ( 1 - 5 )");
  expect(mockClient.lastSay()).toBe("1");
  calc.handle("channel", {}, "!calc", "(6 + 1.5 * (4 + 4 + 4)) * .75");
  expect(mockClient.lastSay()).toBe("18");
  calc.handle("channel", {}, "!calc", "-2 * -3");
  expect(mockClient.lastSay()).toBe("6");
  calc.handle("channel", {}, "!calc", "-2 * (-3+-4)");
  expect(mockClient.lastSay()).toBe("14");
  calc.handle("channel", {}, "!calc", "-3--3");
  expect(mockClient.lastSay()).toBe("0");

  expect(mockClient.saylog.length).toBe(6);
});
