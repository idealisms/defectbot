// This is the client side JS. It will be executed
// in the browser (OBS overlay).
function startWebsocket() {
  var ws = new WebSocket("ws://HOSTNAME:PORT");

  ws.onopen = (event) => {
    console.log("WebSocket Client Connected");
  };

  ws.onmessage = (event) => {
    console.log("Received: '" + event.data + "'");
    const message = JSON.parse(event.data);
    if (message.cmd == "play") {
      var sound = new Howl({
        src: [message.filename],
      });
      sound.play();
    }
  };

  ws.onclose = (event) => {
    console.log("Connection closed");
    ws = null;
    setTimeout(startWebsocket, 5000);
  };
}
startWebsocket();
