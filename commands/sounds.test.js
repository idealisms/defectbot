const Sounds = require("./sounds");
const tmi = require("tmi.js");
const websocket = require("websocket");

jest.mock("tmi.js");
jest.mock("websocket");

test("sounds", () => {
  const mockClient = new tmi.client();
  const soundFilesMap = new Map([
    ["dog", "/sounds/Dog.wav"],
    ["cat", "/sounds/Cat.wav"],
    ["giraffe", "/sounds/Giraffe.wav"],
  ]);
  const mockWebSocketServer = websocket.server;
  mockWebSocketServer.connections = [
    new websocket.connection(),
    new websocket.connection(),
  ];

  const sounds = new Sounds(mockClient, soundFilesMap, mockWebSocketServer);
  expect(sounds.handle("channel", {}, "!listsounds", "")).toBe(true);
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    "Use !listsounds1 and !listsounds2 to see a list of Super Auto Pets sounds I know."
  );
  expect(sounds.handle("channel", {}, "!listsounds1", "")).toBe(true);
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    "I know the following sounds: !cat"
  );
  expect(sounds.handle("channel", {}, "!listsounds2", "")).toBe(true);
  expect(mockClient.say).toHaveBeenCalledWith(
    "channel",
    "I know the following sounds: !dog !giraffe"
  );
  expect(sounds.handle("channel", {}, "!pig", "")).toBe(false);
  expect(sounds.handle("channel", {}, "!dog", "")).toBe(true);
  expect(mockWebSocketServer.connections[0].sendUTF).toHaveBeenCalledWith(
    '{"cmd":"play","filename":"/sounds/Dog.wav"}'
  );
  expect(mockWebSocketServer.connections[1].sendUTF).toHaveBeenCalledWith(
    '{"cmd":"play","filename":"/sounds/Dog.wav"}'
  );
});
