const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3001;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // User joins with a username
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('message', { user: 'System', text: `${username} joined the chat` });
  });

  // User sends a message
  socket.on('send_message', (text) => {
    io.emit('message', { user: socket.username, text });
  });

  // User disconnects
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', { user: 'System', text: `${socket.username} left the chat ` });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});