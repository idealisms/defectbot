// This is the client side JS. It will be executed
// in the browser (OBS overlay).
if (localStorage.getItem("players") == null) {
  localStorage.setItem("players", JSON.stringify([]));
}

var openCount = 0;

function startWebsocket() {
  var ws = new WebSocket("ws://HOSTNAME:PORT");

  ws.onopen = (event) => {
    if (openCount > 0) {
      window.location.reload();
    }
    console.log("WebSocket Client Connected");
    ++openCount;
  };

  ws.onmessage = (event) => {
    console.log("Received: '" + event.data + "'");
    const message = JSON.parse(event.data);
    if (message.cmd == "play") {
      var sound = new Howl({
        src: [message.filename],
      });
      sound.play();
    } else if (message.cmd == "newgame") {
      localStorage.setItem("players", JSON.stringify([message.name]));
      displayPlayers();
    } else if (message.cmd == "addplayer") {
      const players = JSON.parse(localStorage.getItem("players"));
      if (players.length > 0 && players.indexOf(message.name) == -1) {
        players.push(message.name);
        localStorage.setItem("players", JSON.stringify(players));
        displayPlayers();
      }
    } else if (message.cmd == "removeplayer") {
      const players = JSON.parse(localStorage.getItem("players"));
      if (players.indexOf(message.name) == -1) {
        players.push(message.name);
        localStorage.setItem("players", JSON.stringify(players));
        displayPlayers();
      }
    } else if (message.cmd == "cleargame") {
      localStorage.setItem("players", JSON.stringify([]));
      displayPlayers();
    }
  };

  ws.onclose = (event) => {
    console.log("Connection closed");
    ws = null;
    setTimeout(startWebsocket, 5000);
  };
}

function displayPlayers() {
  const players = JSON.parse(localStorage.getItem("players"));
  if (players.length == 0) {
    document.body.innerHTML = "";
    return;
  }
  document.body.innerHTML = `!in to join versus<br><ol>${players.map(p => `<li>${p}</li>`).join('')}</ol>`;
}

window.onload = (event) => {
  displayPlayers();
};
startWebsocket();
