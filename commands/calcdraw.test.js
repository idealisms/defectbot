const CalcDraw = require("./calcdraw");
const tmi = require("tmi.js");

jest.mock("tmi.js");

test("!calcdraw", () => {
  const mockClient = new tmi.client();
  const calc = new CalcDraw(mockClient);
  calc.handle("channel", {}, "!calcdraw", " 5  5  1");
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    expect.stringMatching(/is 1.$/)
  );
  calc.handle("channel", {}, "!calcdraw", "10  5  2");
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    expect.stringMatching(/is 0.7777/)
  );
  calc.handle("channel", {}, "!calcdraw", "10  11 1");
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    expect.stringMatching(/Usage: /)
  );
  calc.handle("channel", {}, "!calcdraw", "14  6   3");
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    expect.stringMatching(/is 0.846153/)
  );
});
