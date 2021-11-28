const Calc = require("./calc");
const tmi = require("tmi.js");

jest.mock("tmi.js");

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
  const mockClient = new tmi.client();
  const calc = new Calc(mockClient);
  calc.handle("channel", {}, "!calc", "1 + 1");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "2");
  calc.handle("channel", {}, "!calc", "3 + 4 * 2 / ( 1 - 5 )");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "1");
  calc.handle("channel", {}, "!calc", "(6 + 1.5 * (4 + 4 + 4)) * .75");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "18");
  calc.handle("channel", {}, "!calc", "-2 * -3");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "6");
  calc.handle("channel", {}, "!calc", "-2 * (-3+-4)");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "14");
  calc.handle("channel", {}, "!calc", "-3--3");
  expect(mockClient.say).toHaveBeenCalledWith("channel", "0");

  expect(mockClient.say).toHaveBeenCalledTimes(6);
});
