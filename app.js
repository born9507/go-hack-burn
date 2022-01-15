const express = require('express');
const { PrismaClient } = require("@prisma/client")

const app = express();

const prisma = new PrismaClient()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/painter', (req, res) => {
  res.sendFile(__dirname + '/painter.html');
});

app.get('/answerer', (req, res) => {
  res.sendFile(__dirname + '/answerer.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.join('room')

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('catchmind/send-message', (data) => {
    console.log('catchmind/send-message');

    const content = data['content'];
    io.in('room').emit('catchmind/send-message', {'content': content})

    // content 가 제시어와 일치하면 정답. 포인트 제공
  });

  socket.on('catchmind/painting', (data) => {
    io.in('room').emit('catchmind/painting', data)
  })
  socket.on('catchmind/not-painting', (data) => {
    io.in('room').emit('catchmind/not-painting', data)
  })

  socket.on('catchmind/erase-all', (_) => {
    io.in('room').emit('catchmind/erase-all')
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
