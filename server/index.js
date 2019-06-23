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

// const socketListener = createSocketListener(server);

io.on('connection', function(socket) {
  console.log('A new client has connected!');
  console.log(socket.id);

  socket.on('new-player', () => {
    gameState.players[socket.id] = {
      cube: {
        x: Math.floor(Math.random() * 400) - 300,
        y: Math.floor(Math.random() * 600) - 300,
        z: 30 + Math.floor(Math.random() * 75),
      },
      id: socket.id,
      imgIdx: Math.floor(Math.random() * 12) + 1,
    };
    socket.emit('establish-players', gameState); //only to person just connected
    socket.broadcast.emit('create-new-player', gameState.players[socket.id]);
    console.log(gameState.players);
  });

  socket.on('draw-from-client', () => {
    //SEND XYZ
    socket.broadcast.emit('move-from-server');
  });

  socket.on('disconnect', function() {
    console.log('user disconnected', socket.id);
    socket.broadcast.emit('delete-player', gameState.players[socket.id]);
    delete gameState.players[socket.id];
  });
});

// setInterval(() => {
//   io.sockets.emit('update', gameState);
// }, 100);

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
