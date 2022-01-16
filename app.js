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
app.use(express.static('public'));
// app.use('/static', express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// url 목록 //
app.get('/', async (req, res) => {
  console.log(req.sessionID);

  const user = await prisma.user.findUnique({
    where: {sessionID: req.sessionID},
  })

  if (user) {
    res.render('index')
  } else {
    res.render('login')
  }
});

app.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
})

app.post('/api/login', async (req, res) => {
  const user = await prisma.user.upsert({
    where: { sessionID: req.sessionID },
    create: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
    update: { sessionID: req.sessionID, name: req.body['name'], univ: req.body['univ'] },
  })
  res.json({ sessionID: user.sessionID, name: user.name, univ: user.univ});
})

app.get('/catchmind', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {sessionID: req.sessionID},
  })

  let catchmindRoom = await prisma.catchmindRoom.findUnique({where: {id: 1}})
  if (!catchmindRoom) {
    if (user) {
      catchmindRoom = await prisma.catchmindRoom.create({data: {painterId: user.id}})
    }
  }

  if (catchmindRoom.painterId == user.id) {
    // 내가 painter 인 경우
    res.render('catchmind/painter')
  } else {
    res.render('catchmind/answerer')
  }
});

app.get('/dodging-obstacle', (req, res) => {
  res.render('dodging-obstacle/index');
});

app.get('/painter', (req, res) => {
  res.render('catchmind/painter');
});

app.get('/answerer', (req, res) => {
  res.render('catchmind/answerer');
});

app.get('/chat', (req, res) => {
  res.render('chat/index');
});

app.get('/dodging-professor', (req, res) => {
  res.render('dodging-professor/index');
})

app.get('/dodging-professor/good', (req, res) => {
  res.render('dodging-professor/goodEndingPage');
  // res.sendFile(__dirname + '/views/goodEndingPage.html');
})

app.get('/dodging-professor/bad', (req, res) => {
  res.render('dodging-professor/badEndingPage');
  // res.sendFile(__dirname + '/views/badEndingPage.html');
})

app.get('/dodging-professor/game', (req, res) => {
  res.render('dodging-professor/gamePage');
  // res.sendFile(__dirname + '/views/gamePage.html');
})

function getPlayerColor(){
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const randomY = 768; //랜덤 생성 위치 범위 조정
const randomX = 1024; //
const canvasWidth = 1024;
const canvasHeight = 768;
// const canvasWidth = 700;
// const canvasHeight = 400;
let enemyFrequency = 1000;
const startX = canvasWidth/2;
const startY = canvasHeight/2;
let stageTime = 15;

let isStart = false;

class Stage{
  constructor(stage){
    this.stage = stage || null;
  }
  setStage(stage){
    return this.stage = stage;
  }
  start(){
    this.stage.start();
  }
}

var enemyRadius = 10;

class PlayerBall{
  constructor(socket){
    this.socket = socket;
    this.x = startX;
    this.y = startY;
    this.color = getPlayerColor();
    this.state = 1;
  }

  get id() {
    return this.socket.id;
  }
}

var balls = [];
var ballMap = {};

function joinGame(socket){
  let ball = new PlayerBall(socket);

  balls.push(ball);
  ballMap[socket.id] = ball;

  return ball;
}

function endGame(socket){
  for( var i = 0 ; i < balls.length; i++){
    if(balls[i].id == socket.id){
      balls.splice(i,1);
      break
    }
  }
  delete ballMap[socket.id];
}


let isAccessFail = false;
let enemyInterval;
let itemInterval;


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.join('room')

  socket.on('disconnect', () => {
    console.log('user disconnected');
    endGame(socket);
    io.sockets.emit('leave_user', socket.id);
    if(balls.length == 0){
      isStart = false;
      clearInterval(enemyInterval);
      timer = 15;
      isAccessFail = false;
    }
  });

  socket.on('chat/send-message', (data) => {
    console.log('chat/send-message');

    const name = data['name'];
    const content = data['content'];
    io.in('room').emit('chat/send-message', {'name': name, 'content': content})
    // content 가 제시어와 일치하면 정답. 포인트 제공
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

  socket.on('catchmind/pop', (_) => {
    console.log('pop')
  })

  let newBall = joinGame(socket);

    socket.emit('user_id', socket.id);

    for (var i = 0 ; i < balls.length; i++){
      let ball = balls[i];
      socket.emit('join_user', {
        id: ball.id,
        x: ball.x,
        y: ball.y,
        color: ball.color,
      });
    }

    socket.broadcast.emit('join_user',{
      id: socket.id,
      x: newBall.x,
      y: newBall.y,
      color: newBall.color,
    });

    if(balls.length > 7 || isAccessFail){//7명 이상 접속시 접속자 차단해버리기
      console.log(socket.id)
      socket.emit('force_disconnect', socket.id);
      endGame(socket);
      io.sockets.emit('leave_user', socket.id);
      socket.disconnect(false);
      isAccessFail = false;
    }

    socket.on('send_location', function(data) {
      socket.broadcast.emit('update_state', {
        id: data.id,
        x: data.x,
        y: data.y,
      })
    })

    function enemyLeftSideGenerator(){
      if(balls.length){
        var randomStartY = Math.floor(Math.random() * randomY)
        var randomDestinationY = Math.floor(Math.random() * randomY)
        io.sockets.emit('enemy_generator', {
          wall : 0,
          startingX:  enemyRadius,
          startingY:  randomStartY,
          destinationX:  canvasWidth+enemyRadius,
          destinationY: randomDestinationY,
        })
      }
    }
    function enemyRightSideGenerator(){
      if(balls.length){
        var randomStartY = Math.floor(Math.random() * randomY)
        var randomDestinationY = Math.floor(Math.random() * randomY)
        io.sockets.emit('enemy_generator', {
          wall : 1,
          startingX:  canvasWidth+enemyRadius,
          startingY:  randomStartY,
          destinationX:  enemyRadius,
          destinationY: randomDestinationY,
        })
      }
    }
    function enemyUpSideGenerator(){
            if(balls.length){
                var randomStartX = Math.floor(Math.random() * randomX);
                var randomDestinationX = Math.floor(Math.random() * randomX);
                io.sockets.emit('enemy_generator', {
                    wall : 2,
                    startingX:  randomStartX,
                    startingY:  enemyRadius,
                    destinationX:  randomDestinationX,
                    destinationY: canvasHeight+enemyRadius,
                })
            }
    }
    function enemyDownSideGenerator(){
            if(balls.length){
                var randomStartX = Math.floor(Math.random() * randomX);
                var randomDestinationX = Math.floor(Math.random() * randomX);
                io.sockets.emit('enemy_generator', {
                    wall : 3,
                    startingX:  randomStartX,
                    startingY:  canvasHeight+enemyRadius,
                    destinationX:  randomDestinationX,
                    destinationY: enemyRadius,
                })
            }
    }

    function enemyGenerator(){//전 방향 벽에서 총알 생성하게 하는거
        enemyLeftSideGenerator();
        enemyRightSideGenerator();
        enemyUpSideGenerator();
        enemyDownSideGenerator();
    }

    function straightEnemyLeftSideGenerator(){
        if(balls.length){
            for(var i=0; i<9; i++){
                var y = 30 + enemyRadius + i*84;
                io.sockets.emit('straight_enemy_generator', {
                    wall : 0,
                    startingX:  enemyRadius,
                    startingY:  y,
                    destinationX:  canvasWidth+enemyRadius,
                    destinationY: y,
                })
            }
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * ra)
            io.sockets.emit('enemy_generator', {
                wall : 0,
                startingX:  enemyRadius,
                startingY:  randomStartY,
                destinationX:  canvasWidth+enemyRadius,
                destinationY: randomDestinationY,
            })
        }
    }

    function straightEnemyRightSideGenerator(){
        if(balls.length){
            for(var i=0; i<9; i++){
                var y = 30 + enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator',{
                    wall : 1,
                        startingX:  canvasWidth+enemyRadius,
                        startingY:  y,
                        destinationX:  enemyRadius,
                        destinationY: y,
                })
            }
        }
    }

    function straightEnemyUpSideGenerator(){
        if(balls.length){
            for(var i=0; i<12; i++){
                var x = 30 + enemyRadius + i* 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall : 2,
                    startingX:  x,
                    startingY:  enemyRadius,
                    destinationX:  x,
                    destinationY: canvasHeight+enemyRadius,
                })
            }
        }
    }

    function straightEnemyDownSideGenerator(){
        if(balls.length){
            for(var i=0; i<12; i++){
                var x = 30+ enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall : 3,
                    startingX:  x,
                    startingY:  canvasHeight+enemyRadius,
                    destinationX:  x,
                    destinationY: enemyRadius,
                })
            }
        }
    }

    function straightEnemyGenerator(stage){
        var random = Math.floor(Math.random() * 2)
        if(stage == 1){
            if(random == 1){
                straightEnemyRightSideGenerator();
            }
            else{
                straightEnemyLeftSideGenerator();
            }
        }
        else if(stage == 0){
            if(random == 1){
                straightEnemyDownSideGenerator();
            }
            else{
                straightEnemyUpSideGenerator();
            }
        }
    }

    const WaitingStage = (function(){//전략패턴 사용
        function WaitingStage(){}
        WaitingStage.prototype.start = function(){
            let count = 0;
            waitInterval = setInterval(function() {
                count += 1;
                if(count >= 5){
                    clearInterval(waitInterval);
                    io.sockets.emit('end_waiting');
                }
            }, 1000);
        };
        return WaitingStage;
    })();

    let itemTime = 5;
    const StageOne = (function(){//전략패턴 사용
        function StageOne(){}
        StageOne.prototype.start = function(){
            let count = 0;
            let stage = 1;
            enemyFrequency = 1000;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= 15){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                            balls[i].state = 1;
                        }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageOne;
    })();

    const StageTwo = (function(){//전략패턴 사용
        function StageTwo(){}
        StageTwo.prototype.start = function(){
            let count = 0;
            let stage = 2;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 900;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("hotsix");
                    itemCount++;
                }
                if (Math.floor(count) >= 17){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageTwo;
    })();

    const StageThree = (function(){//전략패턴 사용
        function StageThree(){}
        StageThree.prototype.start = function(){
            let count = 0;
            let stage = 3;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 800;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("hotsix");
                    itemCount++;
                }
                if(count == 5){
                    straightEnemyGenerator(1);
                }
                if (Math.floor(count) >= 19){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageThree;
    })();

    const StageFour = (function(){//전략패턴 사용
        function StageFour(){}
        StageFour.prototype.start = function(){
            let count = 0;
            let stage = 4;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 700;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if(count == 5){
                    straightEnemyGenerator(0);
                }
                if (Math.floor(count) >= 22){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageFour;
    })();

    const StageFive = (function(){//전략패턴 사용
        function StageFive(){}
        StageFive.prototype.start = function(){
            let count = 0;
            let stage = 5;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 600;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if(count == 4 || count == 9){
                    straightEnemyGenerator(1);
                }
                if (Math.floor(count) >= 26){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageFive;
    })();

    const StageSix = (function(){//전략패턴 사용
        function StageSix(){}
        StageSix.prototype.start = function(){
            let count = 0;
            let stage = 6;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 550;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if(count == 4 || count == 9){
                    straightEnemyGenerator(0);
                }
                if (Math.floor(count) >= 28){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageSix;
    })();

    const StageSeven = (function(){//전략패턴 사용
        function StageSeven(){}
        StageSeven.prototype.start = function(){
            let count = 0;
            let stage = 7;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 500;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if(count == 3 || count == 6 || count == 9){
                    if (count == 6){
                        straightEnemyGenerator(0);
                    }
                    else{
                        straightEnemyGenerator(1);
                    }
                }
                if (Math.floor(count) >= 31){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', {stage : stage+1});
                }
            }, enemyFrequency);
        };
        return StageSeven;
    })();

    const StageEight = (function(){//전략패턴 사용
        function StageEight(){}
        StageEight.prototype.start = function(){
            let count = 0;
            let stage = 8;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 450;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;
                if(Math.floor(count) >= itemTime && itemCount < itemMaximum ){
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if(count == 3 || count == 6 || count == 9){
                    if (count == 6){
                        straightEnemyGenerator(0);
                    }
                    else{
                        straightEnemyGenerator(1);
                    }
                }
                if (Math.floor(count) >= 34){
                    clearInterval(enemyInterval);
                    for (var i = 0 ; i < balls.length ; i++){
                        balls[i].state = 1;
                    }
                    io.sockets.emit('game_win');
                }
            }, enemyFrequency);
        };
        return StageEight;
    })();

    let stageStrategy = new Stage();
    let stageOne = new StageOne;
    let waitingStage = new WaitingStage;
    let stageTwo = new StageTwo;
    let stageThree = new StageThree;
    let stageFour = new StageFour;
    let stageFive = new StageFive;
    let stageSix = new StageSix;
    let stageSeven = new StageSeven;
    let stageEight = new StageEight;

//    let host = balls[0].id;
    if(isStart == false){
      socket.on('start', function(data){
        let host = balls[0].id;
        isAccessFail= true;
        isStart = data.isStart;
        if(host == data.id){
          if(data.waiting == false){
              if(data.stage == 1){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageOne);
                stageStrategy.start();
              }
              else if(data.stage == 2){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageTwo);
                stageStrategy.start();
              }
              else if(data.stage == 3){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageThree);
                stageStrategy.start();
              }
              else if(data.stage == 4){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageFour);
                stageStrategy.start();
              }
              else if(data.stage == 5){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageFive);
                stageStrategy.start();
              }
              else if(data.stage == 6){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageSix);
                stageStrategy.start();
              }
              else if(data.stage == 7){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageSeven);
                stageStrategy.start();
              }
              else if(data.stage == 8){
                io.sockets.emit('start_game');
                stageStrategy.setStage(stageEight);
                stageStrategy.start();
              }
            } else {
                stageStrategy.setStage(waitingStage);
                stageStrategy.start();
            }
        }
      })

    }

    socket.on('collision_detect', function(data){
        for( var i = 0 ; i < balls.length; i++){
            if(balls[i].id == data.id){
                balls[i].state = 0;
                break;
            }
        }
        socket.broadcast.emit('collision_update', {id : data.id})
        isFail = stageFail();
        if(isFail){
            io.sockets.emit('game_over', {isFail: true})
        }
    })

    socket.on('item_detect', function(data){
        if(data.name == "coffee"){
            io.sockets.emit('coffee_effect', {coffee : true});
        }
        else if(data.name == "hotsix"){
            io.sockets.emit('hotsix_effect',{hotsix : true});
        }
    })


    const itemRadius=20;

    function itemLeftSideGenerator(name){
        if(balls.length){
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            if(name == "coffee"){
                io.sockets.emit('item_generator', {
                    wall: 0,
                    startingX: itemRadius,
                    startingY: randomStartY,
                    destinationX: canvasWidth+itemRadius,
                    destinationY: randomDestinationY,
                    name : name
                })
            }
            else if(name == "hotsix"){
                io.sockets.emit('item_generator', {
                    wall: 0,
                    startingX: itemRadius,
                    startingY: randomStartY,
                    destinationX: canvasWidth+itemRadius,
                    destinationY: randomDestinationY,
                    name : name
                })
            }

        }
    }

    function itemRightSideGenerator(name){
        if(balls.length){
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            if(name == "coffee"){
                io.sockets.emit('item_generator', {
                    wall: 1,
                    startingX: canvasWidth+itemRadius,
                    startingY: randomStartY,
                    destinationX: itemRadius,
                    destinationY: randomDestinationY,
                    name : name
                })
            }
            else if(name == "hotsix"){
                io.sockets.emit('item_generator', {
                    wall: 1,
                    startingX: canvasWidth+itemRadius,
                    startingY: randomStartY,
                    destinationX: itemRadius,
                    destinationY: randomDestinationY,
                    name : name
                })
            }

        }
    }

    function itemUpSideGenerator(name){
        if(balls.length){
            var randomStartX = Math.floor(Math.random() * randomX)
            var randomDestinationX = Math.floor(Math.random() * randomX)
            if(name == "coffee"){
                io.sockets.emit('item_generator', {
                    wall: 2,
                    startingX: randomStartX,
                    startingY: itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: canvasHeight+itemRadius,
                    name : name
                })
            }
            else if(name == "hotsix"){
                io.sockets.emit('item_generator', {
                    wall: 2,
                    startingX: randomStartX,
                    startingY: itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: canvasHeight+itemRadius,
                    name : name
                })
            }

        }
    }

    function itemDownSideGenerator(name){
        if(balls.length){
            var randomStartX = Math.floor(Math.random() * randomX)
            var randomDestinationX = Math.floor(Math.random() * randomX)
            if(name == "coffee"){
                io.sockets.emit('item_generator', {
                    wall: 3,
                    startingX: randomStartX,
                    startingY: canvasHeight+itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: itemRadius,
                    name : name
                })
            }
            else if(name == "hotsix"){
                io.sockets.emit('item_generator', {
                    wall: 3,
                    startingX: randomStartX,
                    startingY: canvasHeight+itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: itemRadius,
                    name : name
                })
            }

        }
    }

    function itemGenerator(name){
        k = Math.floor(Math.random)*4
        if(k == 0){
            itemLeftSideGenerator(name);
        }
        else if(k == 1){
            itemRightSideGenerator(name);
        }
        else if(k==2){
            itemUpSideGenerator(name);
        }
        else{
            itemDownSideGenerator(name);
        }
    }


    function stageFail(){
        var isFail = true;
        for(let i = 0 ; i < balls.length ; i++){
            if(balls[i].state == 1){
                isFail = false;
            }
        }
        return isFail;
    }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
