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
        where: { sessionID: req.sessionID },
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
    res.json({ sessionID: user.sessionID, name: user.name, univ: user.univ });
})

app.get('/catchmind', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { sessionID: req.sessionID },
  })

  const catchmindRoom = await prisma.catchmindRoom.findUnique({where:{id:1}})
  if (!catchmindRoom) {
    await prisma.catchmindRoom.create({data: {}});
  }

  if (intervalId == null || timeoutId == null) {
    await prisma.catchmindRoom.update({
      where:{id:1},
      data: {
        painterId: null,
      }
    })
  }

  if (user) {
    const catchmindRoom = await prisma.catchmindRoom.findFirst({
      where: { id: 1 },
    })

    console.log(catchmindRoom.painterId)
    console.log(user.id)

    if (catchmindRoom.painterId == null || catchmindRoom.painterId == user.id) {
      res.render('catchmind/painter', {
        'id': user.id,
        'name': user.name,
        'sessionID': user.sessionID,
        'pointSnu': catchmindRoom.pointSnu,
        'pointKu': catchmindRoom.pointKu,
      })
    } else {
      res.render('catchmind/answerer', {
        'id': user.id,
        'name': user.name,
        'sessionID': user.sessionID,
        'pointSnu': catchmindRoom.pointSnu,
        'pointKu': catchmindRoom.pointKu,
      })
    }
  } else {
    res.redirect('/')
  }
});

app.get('/dodging-obstacle', (req, res) => {
    res.render('dodging-obstacle/index');
});
app.get('/countingstar', (req, res) => {
    res.render('countingstar/index');
});

app.get('/chat', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { sessionID: req.sessionID },
    })
    if (user) {
        res.render('chat/index', {'name': user.name});
    } else {
        res.redirect('/')
    }
});

app.get('/dodging-professor', (req, res) => {
    res.render('dodging-professor/index');
})

app.get('/dodging-professor/good', (req, res) => {
    res.render('dodging-professor/goodEndingPage');
    // res.sendFile(__dirname + '/views/goodEndingPage.html');
})
app.get('/ox-quiz', (req, res) => {
    res.render('ox-quiz/ox-quiz');
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

function getPlayerColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const randomY = 768; //랜덤 생성 위치 범위 조정
const randomX = 1024; //
const canvasWidth = 1024;
const canvasHeight = 768;
// const canvasWidth = 700;
// const canvasHeight = 400;
let enemyFrequency = 1000;
const startX = canvasWidth / 2;
const startY = canvasHeight / 2;
let stageTime = 15;

let isStart = false;

class Stage {
    constructor(stage) {
        this.stage = stage || null;
    }
    setStage(stage) {
        return this.stage = stage;
    }
    start() {
        this.stage.start();
    }
}

var enemyRadius = 10;

class PlayerBall {
    constructor(socket) {
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

function joinGame(socket) {
    let ball = new PlayerBall(socket);

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
}

function endGame(socket) {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].id == socket.id) {
            balls.splice(i, 1);
            break
        }
    }
    delete ballMap[socket.id];
}


let isAccessFail = false;
let enemyInterval;
let itemInterval;

let intervalId;
let timeoutId;

io.on('connection', async (socket) => {
  console.log('a user connected');

    socket.join('chatRoom')
    socket.join('catchmindRoom')

    socket.on('catchmind/expire', async (data) => {
        console.log('catchmind/expire')
        console.log(await io.in('catchmindRoom').fetchSockets())
    })

    socket.on('disconnect', async () => {
        console.log('user disconnected');

        console.log(socket.id)

        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        if (balls.length == 0) {
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
        io.in('chatRoom').emit('chat/send-message', { 'name': name, 'content': content })
    });

    socket.on('catchmind/send-message', async (data) => {
        console.log('catchmind/send-message');

        const name = data['name'];
        const content = data['content'];
        io.in('catchmindRoom').emit('catchmind/send-message', { 'name': name, 'content': content })

        // content 가 제시어와 일치하면 정답. 포인트 제공
        const room = await prisma.catchmindRoom.findUnique({
            where: { id: 1 },
        })

        // 정답인 경우
        if (data['content'] == room.solution) {
          io.in('catchmindRoom').emit('catchmind/right-answer', { 'name': name, 'content': content })

          await prisma.catchmindRoom.update({
              where: { id: 1 },
              data: {
                  painterId: null,
              }
          })
          clearInterval(intervalId);
          clearTimeout(timeoutId);

          var id = data['id']
          var paintPoint = 5
          var answerPoint = 10

          const painter = await prisma.user.findUnique({where: {id: room.painterId}})
          const answerer = await prisma.user.findUnique({where: {id: Number(data['id'])}});

          if (painter.univ === 'snu') {
            await prisma.catchmindRoom.update({
              where: {id: 1},
              data: { pointSnu: {increment: paintPoint} }
            })
          } else if (painter.univ == 'ku') {
            await prisma.catchmindRoom.update({
              where: {id: 1},
              data: { pointKu: {increment: paintPoint} }
            })
          }

          let catchmindRoom;

          if (answerer.univ == 'snu') {
            catchmindRoom = await prisma.catchmindRoom.update({
              where: {id: 1},
              data: { pointSnu: {increment: answerPoint} }
            })
          } else if (answerer.univ == 'ku') {
            catchmindRoom = await prisma.catchmindRoom.update({
              where: {id: 1},
              data: { pointKu: {increment: answerPoint} }
            })
          }
        }
    });

    socket.on('catchmind/painter-enter', async (data) => {
        console.log('catchmind/painter-enter')
        var userId = data['id'];

        let room = await prisma.catchmindRoom.findUnique({
            where: { id: 1 },
        })

        // 그리던 사람이 새로고침할 때
        if (room.painterId === Number(userId)) {
            console.log('same!!')
            socket.emit('catchmind/solution', { 'solution': room.solution })
            return
        }

        solutions = [
          '멋사',
          '사자',
          '강변',
          '퇴학',
          '우거지',
          '대피소',
          '샴푸',
          '피고인',
          '핵가족',
          '연장전',
          '크라잉넛',
          '포크레인',
          '바이오리듬',
          '삼국시대',
          '풍년',
          '작업모',
          '눈안개',
          '새우젓',
          '프라이드치킨',
          '열매',
          '소방관',
          '가라오케',
          '창세기',
          '잎새',
          '인쇄소',
          '슈퍼주니어',
          '전사자',
          '진심',
          '집중',
          '잡종',
          '태양',
          '조선소',
          '손맛',
          '이모',
          '귓속말',
          '백수',
          '공고문',
          '카레이서',
          '쓰레기차',
          '진공청소기',
          '우거지',
          '일간신문',
          '개인기',
          '김경호',
          '가격표',
          '가로수',
          '산모',
          '알까기',
          '카카오나무',
          '홍삼',
          '차세대',
          '개발제한',
          '키보드',
          '사건',
          '도도새',
          '백댄서',
          '경찰',
          '고드름',
          '코너킥',
          '도끼',
          '바이올린',
          '팬미팅',
          '냉커피',
          '도토리묵',
          '웅변',
          '북극여우',
          '신세계',
          '물건',
          '사무직',
          '서라벌',
          '발가락',
          '베개',
          '우럭',
          '가시',
          '북극곰',
          '위기',
          '소나기',
          '주유소',
          '버섯',
          '피서',
          '약국',
        ]

        var solution = solutions[Math.floor(Math.random() * solutions.length)];

        socket.emit('catchmind/solution', { 'solution': solution })

        await prisma.catchmindRoom.update({
            where: { id: 1 },
            data: {
                painterId: Number(userId),
                solution: solution,
            }
        })

        var time = 30;
        var timeLeft = time;

        intervalId = setInterval(async () => {
            if (timeLeft > 0) {
                io.in('catchmindRoom').emit('catchmind/time-left', { 'timeLeft': timeLeft })
                timeLeft = timeLeft - 1;
            }
        }, 1000);
        timeoutId = setTimeout(async () => {
            await prisma.catchmindRoom.update({
                where: { id: 1 },
                data: {
                    painterId: null,
                }
            })
            io.in('catchmindRoom').emit('catchmind/expire')

            clearInterval(intervalId);
            clearTimeout(timeoutId);
        }, time * 1000);
    })

    socket.on('catchmind/answerer-enter', async (data) => {
    })

    socket.on('catchmind/painting', (data) => {
        io.in('catchmindRoom').emit('catchmind/painting', data)
    })
    socket.on('catchmind/not-painting', (data) => {
        io.in('catchmindRoom').emit('catchmind/not-painting', data)
    })

    socket.on('catchmind/erase-all', (_) => {
        io.in('catchmindRoom').emit('catchmind/erase-all')
    })

    socket.on('catchmind/pop', (_) => {
        console.log('pop')
    })

    let newBall = joinGame(socket);

    socket.emit('user_id', socket.id);

    for (var i = 0; i < balls.length; i++) {
        let ball = balls[i];
        socket.emit('join_user', {
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
        });
    }

    socket.broadcast.emit('join_user', {
        id: socket.id,
        x: newBall.x,
        y: newBall.y,
        color: newBall.color,
    });

    if (balls.length > 7 || isAccessFail) {//7명 이상 접속시 접속자 차단해버리기
        console.log(socket.id)
        socket.emit('force_disconnect', socket.id);
        endGame(socket);
        io.sockets.emit('leave_user', socket.id);
        socket.disconnect(false);
        isAccessFail = false;
    }

    socket.on('send_location', function (data) {
        socket.broadcast.emit('update_state', {
            id: data.id,
            x: data.x,
            y: data.y,
        })
    })

    function enemyLeftSideGenerator() {
        if (balls.length) {
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            io.sockets.emit('enemy_generator', {
                wall: 0,
                startingX: enemyRadius,
                startingY: randomStartY,
                destinationX: canvasWidth + enemyRadius,
                destinationY: randomDestinationY,
            })
        }
    }
    function enemyRightSideGenerator() {
        if (balls.length) {
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            io.sockets.emit('enemy_generator', {
                wall: 1,
                startingX: canvasWidth + enemyRadius,
                startingY: randomStartY,
                destinationX: enemyRadius,
                destinationY: randomDestinationY,
            })
        }
    }
    function enemyUpSideGenerator() {
        if (balls.length) {
            var randomStartX = Math.floor(Math.random() * randomX);
            var randomDestinationX = Math.floor(Math.random() * randomX);
            io.sockets.emit('enemy_generator', {
                wall: 2,
                startingX: randomStartX,
                startingY: enemyRadius,
                destinationX: randomDestinationX,
                destinationY: canvasHeight + enemyRadius,
            })
        }
    }
    function enemyDownSideGenerator() {
        if (balls.length) {
            var randomStartX = Math.floor(Math.random() * randomX);
            var randomDestinationX = Math.floor(Math.random() * randomX);
            io.sockets.emit('enemy_generator', {
                wall: 3,
                startingX: randomStartX,
                startingY: canvasHeight + enemyRadius,
                destinationX: randomDestinationX,
                destinationY: enemyRadius,
            })
        }
    }

    function enemyGenerator() {//전 방향 벽에서 총알 생성하게 하는거
        enemyLeftSideGenerator();
        enemyRightSideGenerator();
        enemyUpSideGenerator();
        enemyDownSideGenerator();
    }

    function straightEnemyLeftSideGenerator() {
        if (balls.length) {
            for (var i = 0; i < 9; i++) {
                var y = 30 + enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall: 0,
                    startingX: enemyRadius,
                    startingY: y,
                    destinationX: canvasWidth + enemyRadius,
                    destinationY: y,
                })
            }
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * ra)
            io.sockets.emit('enemy_generator', {
                wall: 0,
                startingX: enemyRadius,
                startingY: randomStartY,
                destinationX: canvasWidth + enemyRadius,
                destinationY: randomDestinationY,
            })
        }
    }

    function straightEnemyRightSideGenerator() {
        if (balls.length) {
            for (var i = 0; i < 9; i++) {
                var y = 30 + enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall: 1,
                    startingX: canvasWidth + enemyRadius,
                    startingY: y,
                    destinationX: enemyRadius,
                    destinationY: y,
                })
            }
        }
    }

    function straightEnemyUpSideGenerator() {
        if (balls.length) {
            for (var i = 0; i < 12; i++) {
                var x = 30 + enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall: 2,
                    startingX: x,
                    startingY: enemyRadius,
                    destinationX: x,
                    destinationY: canvasHeight + enemyRadius,
                })
            }
        }
    }

    function straightEnemyDownSideGenerator() {
        if (balls.length) {
            for (var i = 0; i < 12; i++) {
                var x = 30 + enemyRadius + i * 84;
                io.sockets.emit('straight_enemy_generator', {
                    wall: 3,
                    startingX: x,
                    startingY: canvasHeight + enemyRadius,
                    destinationX: x,
                    destinationY: enemyRadius,
                })
            }
        }
    }

    function straightEnemyGenerator(stage) {
        var random = Math.floor(Math.random() * 2)
        if (stage == 1) {
            if (random == 1) {
                straightEnemyRightSideGenerator();
            }
            else {
                straightEnemyLeftSideGenerator();
            }
        }
        else if (stage == 0) {
            if (random == 1) {
                straightEnemyDownSideGenerator();
            }
            else {
                straightEnemyUpSideGenerator();
            }
        }
    }

    const WaitingStage = (function () {//전략패턴 사용
        function WaitingStage() { }
        WaitingStage.prototype.start = function () {
            let count = 0;
            waitInterval = setInterval(function () {
                count += 1;
                if (count >= 5) {
                    clearInterval(waitInterval);
                    io.sockets.emit('end_waiting');
                }
            }, 1000);
        };
        return WaitingStage;
    })();

    let itemTime = 5;
    const StageOne = (function () {//전략패턴 사용
        function StageOne() { }
        StageOne.prototype.start = function () {
            let count = 0;
            let stage = 1;
            enemyFrequency = 1000;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= 15) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageOne;
    })();

    const StageTwo = (function () {//전략패턴 사용
        function StageTwo() { }
        StageTwo.prototype.start = function () {
            let count = 0;
            let stage = 2;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 900;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("hotsix");
                    itemCount++;
                }
                if (Math.floor(count) >= 17) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageTwo;
    })();

    const StageThree = (function () {//전략패턴 사용
        function StageThree() { }
        StageThree.prototype.start = function () {
            let count = 0;
            let stage = 3;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 800;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("hotsix");
                    itemCount++;
                }
                if (count == 5) {
                    straightEnemyGenerator(1);
                }
                if (Math.floor(count) >= 19) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageThree;
    })();

    const StageFour = (function () {//전략패턴 사용
        function StageFour() { }
        StageFour.prototype.start = function () {
            let count = 0;
            let stage = 4;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 700;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if (count == 5) {
                    straightEnemyGenerator(0);
                }
                if (Math.floor(count) >= 22) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageFour;
    })();

    const StageFive = (function () {//전략패턴 사용
        function StageFive() { }
        StageFive.prototype.start = function () {
            let count = 0;
            let stage = 5;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 600;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if (count == 4 || count == 9) {
                    straightEnemyGenerator(1);
                }
                if (Math.floor(count) >= 26) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageFive;
    })();

    const StageSix = (function () {//전략패턴 사용
        function StageSix() { }
        StageSix.prototype.start = function () {
            let count = 0;
            let stage = 6;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 550;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if (count == 4 || count == 9) {
                    straightEnemyGenerator(0);
                }
                if (Math.floor(count) >= 28) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageSix;
    })();

    const StageSeven = (function () {//전략패턴 사용
        function StageSeven() { }
        StageSeven.prototype.start = function () {
            let count = 0;
            let stage = 7;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 500;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;

                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if (count == 3 || count == 6 || count == 9) {
                    if (count == 6) {
                        straightEnemyGenerator(0);
                    }
                    else {
                        straightEnemyGenerator(1);
                    }
                }
                if (Math.floor(count) >= 31) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
                        balls[i].state = 1;
                    }
                    io.sockets.emit('stage_clear', { stage: stage + 1 });
                }
            }, enemyFrequency);
        };
        return StageSeven;
    })();

    const StageEight = (function () {//전략패턴 사용
        function StageEight() { }
        StageEight.prototype.start = function () {
            let count = 0;
            let stage = 8;
            let itemMaximum = 1;
            let itemCount = 0;
            enemyFrequency = 450;
            enemyInterval = setInterval(function () {
                enemyGenerator();
                count += 1;
                if (Math.floor(count) >= itemTime && itemCount < itemMaximum) {
                    console.log(count);
                    itemGenerator("coffee");
                    itemCount++;
                }
                if (count == 3 || count == 6 || count == 9) {
                    if (count == 6) {
                        straightEnemyGenerator(0);
                    }
                    else {
                        straightEnemyGenerator(1);
                    }
                }
                if (Math.floor(count) >= 34) {
                    clearInterval(enemyInterval);
                    for (var i = 0; i < balls.length; i++) {
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
    if (isStart == false) {
        socket.on('start', function (data) {
            let host = balls[0].id;
            isAccessFail = true;
            isStart = data.isStart;
            if (host == data.id) {
                if (data.waiting == false) {
                    if (data.stage == 1) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageOne);
                        stageStrategy.start();
                    }
                    else if (data.stage == 2) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageTwo);
                        stageStrategy.start();
                    }
                    else if (data.stage == 3) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageThree);
                        stageStrategy.start();
                    }
                    else if (data.stage == 4) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageFour);
                        stageStrategy.start();
                    }
                    else if (data.stage == 5) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageFive);
                        stageStrategy.start();
                    }
                    else if (data.stage == 6) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageSix);
                        stageStrategy.start();
                    }
                    else if (data.stage == 7) {
                        io.sockets.emit('start_game');
                        stageStrategy.setStage(stageSeven);
                        stageStrategy.start();
                    }
                    else if (data.stage == 8) {
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

    socket.on('collision_detect', function (data) {
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].id == data.id) {
                balls[i].state = 0;
                break;
            }
        }
        socket.broadcast.emit('collision_update', { id: data.id })
        isFail = stageFail();
        if (isFail) {
            io.sockets.emit('game_over', { isFail: true })
        }
    })

    socket.on('item_detect', function (data) {
        if (data.name == "coffee") {
            io.sockets.emit('coffee_effect', { coffee: true });
        }
        else if (data.name == "hotsix") {
            io.sockets.emit('hotsix_effect', { hotsix: true });
        }
    })


    const itemRadius = 20;

    function itemLeftSideGenerator(name) {
        if (balls.length) {
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            if (name == "coffee") {
                io.sockets.emit('item_generator', {
                    wall: 0,
                    startingX: itemRadius,
                    startingY: randomStartY,
                    destinationX: canvasWidth + itemRadius,
                    destinationY: randomDestinationY,
                    name: name
                })
            }
            else if (name == "hotsix") {
                io.sockets.emit('item_generator', {
                    wall: 0,
                    startingX: itemRadius,
                    startingY: randomStartY,
                    destinationX: canvasWidth + itemRadius,
                    destinationY: randomDestinationY,
                    name: name
                })
            }

        }
    }

    function itemRightSideGenerator(name) {
        if (balls.length) {
            var randomStartY = Math.floor(Math.random() * randomY)
            var randomDestinationY = Math.floor(Math.random() * randomY)
            if (name == "coffee") {
                io.sockets.emit('item_generator', {
                    wall: 1,
                    startingX: canvasWidth + itemRadius,
                    startingY: randomStartY,
                    destinationX: itemRadius,
                    destinationY: randomDestinationY,
                    name: name
                })
            }
            else if (name == "hotsix") {
                io.sockets.emit('item_generator', {
                    wall: 1,
                    startingX: canvasWidth + itemRadius,
                    startingY: randomStartY,
                    destinationX: itemRadius,
                    destinationY: randomDestinationY,
                    name: name
                })
            }

        }
    }

    function itemUpSideGenerator(name) {
        if (balls.length) {
            var randomStartX = Math.floor(Math.random() * randomX)
            var randomDestinationX = Math.floor(Math.random() * randomX)
            if (name == "coffee") {
                io.sockets.emit('item_generator', {
                    wall: 2,
                    startingX: randomStartX,
                    startingY: itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: canvasHeight + itemRadius,
                    name: name
                })
            }
            else if (name == "hotsix") {
                io.sockets.emit('item_generator', {
                    wall: 2,
                    startingX: randomStartX,
                    startingY: itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: canvasHeight + itemRadius,
                    name: name
                })
            }

        }
    }

    function itemDownSideGenerator(name) {
        if (balls.length) {
            var randomStartX = Math.floor(Math.random() * randomX)
            var randomDestinationX = Math.floor(Math.random() * randomX)
            if (name == "coffee") {
                io.sockets.emit('item_generator', {
                    wall: 3,
                    startingX: randomStartX,
                    startingY: canvasHeight + itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: itemRadius,
                    name: name
                })
            }
            else if (name == "hotsix") {
                io.sockets.emit('item_generator', {
                    wall: 3,
                    startingX: randomStartX,
                    startingY: canvasHeight + itemRadius,
                    destinationX: randomDestinationX,
                    destinationY: itemRadius,
                    name: name
                })
            }

        }
    }

    function itemGenerator(name) {
        k = Math.floor(Math.random) * 4
        if (k == 0) {
            itemLeftSideGenerator(name);
        }
        else if (k == 1) {
            itemRightSideGenerator(name);
        }
        else if (k == 2) {
            itemUpSideGenerator(name);
        }
        else {
            itemDownSideGenerator(name);
        }
    }


    function stageFail() {
        var isFail = true;
        for (let i = 0; i < balls.length; i++) {
            if (balls[i].state == 1) {
                isFail = false;
            }
        }
        return isFail;
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
