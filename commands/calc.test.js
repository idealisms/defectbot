const calc = require("./calc");

test("tokenize", () => {
  expect(calc.tokenizeForTest("1+1")).toEqual(["1", "+", "1"]);
  expect(calc.tokenizeForTest("1 + 1")).toEqual(["1", "+", "1"]);
  expect(calc.tokenizeForTest("foo")).toEqual([]);
  expect(calc.tokenizeForTest("System.eval")).toEqual([]);
  expect(calc.tokenizeForTest("1..2 ..2 2.2 3..")).toEqual(["2.2"]);
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
});
