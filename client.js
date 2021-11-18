// This is the client side JS. It will be executed
// in the browser (OBS overlay).
const ws = new WebSocket("ws://HOSTNAME:PORT/");
ws.onopen = function () {
  console.log("WebSocket Client Connected");
  ws.send("Giraffe?");
};
ws.onmessage = function (e) {
  console.log("Received: '" + e.data + "'");
};
