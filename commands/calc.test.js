const calc = require("./calc");

test("tokenize", () => {
  expect(calc.tokenizeForTest("1+1")).toEqual(["1", "+", "1"]);
  expect(calc.tokenizeForTest("1 + 1")).toEqual(["1", "+", "1"]);
  expect(calc.tokenizeForTest("foo")).toEqual([]);
  expect(calc.tokenizeForTest("System.eval")).toEqual([]);
  expect(calc.tokenizeForTest("-5")).toEqual(["-5"]);
  expect(calc.tokenizeForTest("-5.0")).toEqual(["-5.0"]);
  expect(calc.tokenizeForTest("-5.")).toEqual(["-5."]);
  expect(calc.tokenizeForTest("-.5")).toEqual(["-.5"]);
  expect(calc.tokenizeForTest("1+-5")).toEqual(["1", "+", "-5"]);
  expect(calc.tokenizeForTest("1-5")).toEqual(["1", "-", "5"]);
  expect(calc.tokenizeForTest("(-5-2)")).toEqual(["(", "-5", "-", "2", ")"]);
  expect(calc.tokenizeForTest("-5--2")).toEqual(["-5", "-", "-2"]);
  expect(calc.tokenizeForTest("1..2 ..2 2.2 3..")).toEqual([]);
  expect(calc.tokenizeForTest("1.0-+1")).toEqual(["1.0", "-", "+", "1"]);
  expect(calc.tokenizeForTest("(8+1.5 * (4+4+4) )*.75")).toEqual([
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
  expect(calc.tokenizeForTest("3 + 4 * 2 / ( 1 - 5 )")).toEqual([
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
    calc.shuntingYardForTest([
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

test("calc", () => {
  calc("1 + 1", (out) => {
    expect(out).toBe("2");
  });
  calc("3 + 4 * 2 / ( 1 - 5 )", (out) => {
    expect(out).toBe("1");
  });
  calc("(6 + 1.5 * (4 + 4 + 4)) * .75", (out) => {
    expect(out).toBe("18");
  });
  calc("-2 * -3", (out) => {
    expect(out).toBe("6");
  });
  calc("-2 * (-3+-4)", (out) => {
    expect(out).toBe("14");
  });
  calc("-3--3", (out) => {
    expect(out).toBe("0");
  });
});
