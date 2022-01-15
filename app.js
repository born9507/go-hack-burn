const express = require('express');
const { PrismaClient } = require("@prisma/client")
const http = require('http');
const { Server } = require("socket.io");
const session = require('express-session')

const app = express();
const prisma = new PrismaClient()
const server = http.createServer(app);
const io = new Server(server);

app.use(session({
  secret: 'hahahoho',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json())

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', async (req, res) => {
  console.log(req.sessionID);

  const user = await prisma.user.findUnique({
    where: {sessionID: req.sessionID},
  })

  if (user) {
    res.render('index')
  } else {
    res.render('signup')
  }
});

app.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
})

// app.get('/signup', async (req, res) => {
//   const user = await prisma.user.upsert({
//     where: { sessionID: req.sessionID },
//     create: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
//     update: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
//   })
//   res.redirect('/');
// })

app.post('/api/signup', async (req, res) => {
  const user = await prisma.user.upsert({
    where: { sessionID: req.sessionID },
    create: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
    update: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
  })
  res.json({ sessionID: user.sessionID, name: user.name, univ: user.univ});
})

app.get('/catchmind', async (req, res) => {
  // console.log(await prisma.user.findMany())
  res.render('painter')
});

app.get('/painter', (req, res) => {
  res.render('painter');
});

app.get('/answerer', (req, res) => {
  res.render('answerer');
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
