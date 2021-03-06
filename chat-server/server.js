const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 3003;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let myConnections = {};
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    if (message.length === 1) {
      myConnections[message] = ws;
    } else {
      const msg = JSON.parse(message);
      myConnections[msg.sender_id].send(JSON.stringify(msg));
      if (myConnections[msg.recipient_id]) {
        myConnections[msg.recipient_id].send(JSON.stringify(msg));
      }

    }
  });



  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    // wss.clients.forEach(function each(client) {
    //   client.send(JSON.stringify(wss.clients.size));
    // });
    console.log('Client disconnected')
  });
});