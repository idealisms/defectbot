// This is the client side JS. It will be executed
// in the browser (OBS overlay).
const ws = new WebSocket("ws://HOSTNAME:PORT/");
ws.onopen = function () {
  console.log("WebSocket Client Connected");
  // Should we send a keep alive?
};
ws.onmessage = function (event) {
  console.log("Received: '" + event.data + "'");
  const message = JSON.parse(event.data);
  if (message.cmd == "play") {
    var sound = new Howl({
      src: [message.filename],
    });
    sound.play();
  }
};
