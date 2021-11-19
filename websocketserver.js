const WebSocketServer = require("websocket").server;

function createWebSocketServer(opts, httpServer) {
  const wsServer = new WebSocketServer({
    httpServer,
  });

  wsServer.on("request", function (request) {
    const connection = request.accept(null, request.origin);
    connection.on("message", function (message) {
      console.log("Received Message:", message.utf8Data);
    });
    connection.on("close", function (reasonCode, description) {
      console.log("Client has disconnected.");
    });
  });

  return wsServer;
}
module.exports = { createWebSocketServer };
