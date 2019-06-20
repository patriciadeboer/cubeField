const path = require('path');
const express = require('express');
const app = express();
const PORT = 8080;
const socketio = require('socket.io');

const gameState = {
  players: {},
};

const server = app.listen(PORT, () =>
  console.log(`listening on port http://localhost:${PORT}`)
);

var io = socketio(server);

io.on('connection', function(socket) {
  console.log('A new client has connected!');
  console.log(socket.id);

  socket.on('newPlayer', () => {
    gameState.players[socket.id] = {
      x: 250,
      y: 250,
      z: 0,
    };
  });
  console.log(gameState.players);

  socket.on('disconnect', function() {
    console.log('user disconnected');
    console.log(socket.id);
    delete gameState.players[socket.id];
    console.log(gameState.players);
  });
});

setInterval(() => {
  io.sockets.emit('state', gameState);
}, 1000 / 60);

app.use(express.static(path.join(__dirname, '../public')));
app.use('*/imgs', express.static('public/imgs'));

// any remaining requests with an extension send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
