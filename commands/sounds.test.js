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
    "I know the following sounds: https://raw.githubusercontent.com/idealisms/defectbot/main/sounds/list%20of%20animal%20sounds.txt"
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
