
class PlayerBall {
    constructor(id, color, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.state = 1;
        this.radius = 16;
        this.playerSpeed = 4;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    getPlayerSpeed() {
        return this.playerSpeed;
    }
    setPlayerSpeed(playerSpeed) {
        this.playerSpeed = playerSpeed;
    }
}

class EnemyBall {
    constructor(x, y, destinationX, destinationY, wall) {

        this.color = "#000000";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 10;
        this.aliveTime = 300;
        this.speedX = 0;
        this.speedY = 0;
    }
    getSpeedX() {
        return this.speedX;
    }
    setSpeedX(speedX) {
        this.speedX = speedX;
    }

    getSpeedY() {
        return this.speedY;
    }
    setSpeedY(speedY) {
        this.speedY = speedY;
    }

    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getDestinationX() {
        return this.destinationX;
    }
    setDestinationX(destinationX) {
        this.destinationX = destinationX;
    }
    getDestinationY() {
        return this.destinationY;
    }
    setDestinationY(destinationY) {
        this.destinationY = destinationY;
    }
    getInitialX() {
        return this.initialX;
    }
    setInitialX(initialX) {
        this.initialX = initialX;
    }
    getInitialY() {
        return this.initialY;
    }
    setInitialY(initialY) {
        this.initialY = initialY;
    }
    getWall() {
        return this.wall;
    }
    setWall(wall) {
        this.wall = wall;
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    getAliveTime() {
        return this.aliveTime;
    }
    setAliveTime(aliveTime) {
        this.aliveTime = aliveTime;
    }
}

class straightEnemyBall {
    constructor(x, y, destinationX, destinationY, wall) {

        this.color = "#000000";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 10;
        this.aliveTime = 300;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getDestinationX() {
        return this.destinationX;
    }
    setDestinationX(destinationX) {
        this.destinationX = destinationX;
    }
    getDestinationY() {
        return this.destinationY;
    }
    setDestinationY(destinationY) {
        this.destinationY = destinationY;
    }
    getInitialX() {
        return this.initialX;
    }
    setInitialX(initialX) {
        this.initialX = initialX;
    }
    getInitialY() {
        return this.initialY;
    }
    setInitialY(initialY) {
        this.initialY = initialY;
    }
    getWall() {
        return this.wall;
    }
    setWall(wall) {
        this.wall = wall;
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    getAliveTime() {
        return this.aliveTime;
    }
    setAliveTime(aliveTime) {
        this.aliveTime = aliveTime;
    }
}

class itemBall {
    constructor(x, y, destinationX, destinationY, wall, name) {

        this.color = "#6f4e37";
        this.x = x;
        this.y = y;
        this.destinationX = destinationX;
        this.destinationY = destinationY;
        this.initialX = x;
        this.initialY = y;
        this.wall = wall;
        this.radius = 20;
        this.aliveTime = 1000;
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getColor(name) {
        if (name == "coffee") {
            return this.color;
        }
        else if (name == "hotsix") {
            return "#0067a3";
        }

    }
    setColor(color) {
        this.color = color;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getDestinationX() {
        return this.destinationX;
    }
    setDestinationX(destinationX) {
        this.destinationX = destinationX;
    }
    getDestinationY() {
        return this.destinationY;
    }
    setDestinationY(destinationY) {
        this.destinationY = destinationY;
    }
    getInitialX() {
        return this.initialX;
    }
    setInitialX(initialX) {
        this.initialX = initialX;
    }
    getInitialY() {
        return this.initialY;
    }
    setInitialY(initialY) {
        this.initialY = initialY;
    }
    getWall() {
        return this.wall;
    }
    setWall(wall) {
        this.wall = wall;
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    getAliveTime() {
        return this.aliveTime;
    }
    setAliveTime(aliveTime) {
        this.aliveTime = aliveTime;
    }
}


var professor = '/dodging-professor/images/professor.png';
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var balls = [];
var ballMap = {};
var myId;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;


const rangeX = 1400;
const canvasWidth = 1024;
const canvasHeight = 768;
const nickName = localStorage.getItem("nickName")
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//유저 접속
function joinUser(id, color, x, y) {
    let ball = new PlayerBall(id, color, x, y);
    ball.setColor(color);
    ball.setX(x);
    ball.setY(y);

    balls.push(ball);
    ballMap[id] = ball;

    return ball;
}
//유저 leave
function leaveUser(id) {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].getId() == id) {
            balls.splice(i, 1);
            break;
        }
    }
    delete ballMap[id];
}
//유저 관리
function updateState(id, x, y) {
    let ball = ballMap[id];
    if (!ball) {
        return;
    }
    ball.setX(x);
    ball.setY(y);
}
function sendData() {
    let curPlayer = ballMap[myId];
    let data = {};
    data = {
        id: curPlayer.getId(),
        x: curPlayer.getX(),
        y: curPlayer.getY(),
    };
    if (data) {
        socket.emit("send_location", data);
    }
}
//충돌 감지
function collisionDetection() {
    let ball = ballMap[myId]
    for (var i = 0; i < enemys.length; i++) {
        if (Math.sqrt((ball.getX() - enemys[i].getX()) ** 2 + (ball.getY() - enemys[i].getY()) ** 2) <= enemys[i].getRadius() + ball.getRadius()) {
            ball.setState(0);
            socket.emit('collision_detect', { id: ball.getId() });
            break;
        }
    }
    for (var i = 0; i < straightEnemys.length; i++) {
        if (Math.sqrt((ball.getX() - straightEnemys[i].getX()) ** 2 + (ball.getY() - straightEnemys[i].getY()) ** 2) <= straightEnemys[i].getRadius() + ball.getRadius()) {
            ball.setState(0);
            socket.emit('collision_detect', { id: ball.getId() });
            break;
        }
    }
}
//아이템 획득관리
function acquireDetection() {
    let ball = ballMap[myId]
    for (var i = 0; i < items.length; i++) {
        if (ball.getState() != 0 && Math.sqrt((ball.getX() - items[i].getX()) ** 2 + (ball.getY() - items[i].getY()) ** 2) <= ball.getRadius() + items[i].getRadius()) {
            socket.emit('item_detect', { name: items[i].getName() });//보낼때 아이템 정보 보내주기
            items.splice(i, 1);
            break;
        }
    }
}


//서버 소켓
var socket = io();

socket.on('user_id', function (data) {
    myId = data;
});
socket.on('join_user', function (data) {
    joinUser(data.id, data.color, data.x, data.y);
})
socket.on('leave_user', function (data) {
    leaveUser(data);
})
socket.on('update_state', function (data) {
    updateState(data.id, data.x, data.y);
})

socket.on('collision_update', function (data) {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].getId() == data.id) {
            balls[i].setState(0);
            break;
        }
    }
})


var enemys = [];
var straightEnemys = [];
var items = [];

let hotsixEffect = false;

//일정 인원 수 이상 일 경우
socket.on('force_disconnect', function (data) {
    Swal.fire({
        title: "게임 알림",
        text: "현재 게임 중입니다. 나중에 접속 해 주세요.",
        confirmButtonText: "네",
        confirmButtonColor: '#FC5296'
    });
    window.close();
    self.close();
    window.opener = window.location.href; self.close();
    window.open('about:blank', '_self').close();
})
//적 생성
socket.on('enemy_generator', function (data) {
    if (hotsixEffect == false) {

        let enemy = new EnemyBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall)
        enemys.push(enemy);
    }

})

socket.on('straight_enemy_generator', function (data) {
    console.log('hello');
    let straightEnemy = new straightEnemyBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall)
    straightEnemys.push(straightEnemy);
    console.log(straightEnemys);
})


socket.on('item_generator', function (data) {
    let item = new itemBall(data.startingX, data.startingY, data.destinationX, data.destinationY, data.wall, data.name)
    items.push(item);
    console.log(items);
})

let coffeeEffect = false;
socket.on('coffee_effect', function (data) {
    coffeeEffect = data.coffee;
})
let stopTimer = 0;
socket.on('hotsix_effect', function (data) {
    hotsixEffect = data.hotsix;
    stopTimer = timer;
})


//스테이지 관리
let stage = 1;
socket.on('stage_number', function (data) {
    stage = data.stage;
    timer = data.timer;
    console.log(stage)
})

//게임 오버
socket.on('game_over', function (data) {//전 플레이어가 죽으면 나오는 이벤트
    if (data.isFail) {
        stage = 1;
        location.href = "/dodging-professor/bad";
        // Swal.fire({
        //     title: "게임 알림",
        //     text: "교수님이 이겼습니다.",
        //     confirmButtonText: "아니..",
        //     confirmButtonColor: '#FC5296'
        // }).then((result)=> {

        //     location.href= "/bad";
        // })
    }
})

//게임 윈
socket.on('game_win', function (data) {
    stage = 1;
    Swal.fire({
        title: "게임 알림",
        text: "당신이 이겼습니다! 축하드립니다.",
        confirmButtonText: "확인",
        confirmButtonColor: '#FC5296'
    }).then((result) => {
        location.href = "/dodging-professor/good";
    })
})


//스테이지 알림
function renderStage() {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.fillText(`Stage ${stage}`, 30, 30);
    ctx.closePath();
}


function renderPlayers() {
    let curPlayer = ballMap[myId];
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        if (ball.getState() == 0) {
            continue
        }
        ctx.beginPath();
        ctx.fillStyle = ball.getColor();
        ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        if (ball == curPlayer) {

            ctx.beginPath();
            ctx.font = '15px Arial';
            ctx.fillText(`${nickName}`, ball.getX() - ball.getRadius() - 7, ball.getY() - ball.getRadius());
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.font = '15px Arial';
            ctx.fillText(`player${i}`, ball.getX() - ball.getRadius() - 7, ball.getY() - ball.getRadius());
            ctx.closePath();
        }
    }

    if (rightPressed) {
        if (curPlayer.getX() <= canvasWidth - curPlayer.getRadius()) {
            curPlayer.setX(curPlayer.getX() + curPlayer.getPlayerSpeed());
        }
    }
    if (leftPressed) {
        if (curPlayer.getX() >= 0 + curPlayer.getRadius()) {
            curPlayer.setX(curPlayer.getX() - curPlayer.getPlayerSpeed());
        }
    }
    if (upPressed) {
        if (curPlayer.getY() >= 0 + curPlayer.getRadius()) {
            curPlayer.setY(curPlayer.getY() - curPlayer.getPlayerSpeed());
        }
    }
    if (downPressed) {
        if (curPlayer.getY() <= canvasHeight - curPlayer.getRadius()) {
            curPlayer.setY(curPlayer.getY() + curPlayer.getPlayerSpeed());
        }
    }
}

function renderEnemys() {
    for (let j = 0; j < enemys.length; j++) {
        let enemy = enemys[j];
        ctx.beginPath();
        ctx.fillStyle = enemy.getColor();
        ctx.arc(enemy.getX(), enemy.getY(), enemy.getRadius(), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

    }
    for (let k = 0; k < enemys.length; k++) {
        let enemy = enemys[k];
        var distanceX = Math.abs(enemy.getDestinationX() - enemy.getInitialX());
        var distanceY = Math.abs(enemy.getDestinationY() - enemy.getInitialY());
        var speedY = distanceY / enemy.getAliveTime();
        var speedX = distanceX / enemy.getAliveTime();
        enemy.setSpeedX(speedX);
        enemy.setSpeedY(speedY);
        if (hotsixEffect) {
            items.length = 0;
            enemy.setSpeedX(0);
            enemy.setSpeedY(0);
            enemy.setX(enemy.getX());
            enemy.setY(enemy.getY());
            if (Math.abs(stopTimer - timer) >= 3) {
                hotsixEffect = false;
            }

        }
        if (enemy.getWall() == 0) {//leftSide
            if (enemy.getDestinationY() >= enemy.getY()) {
                enemy.setX(enemy.getX() + enemy.getSpeedX());
                enemy.setY(enemy.getY() + enemy.getSpeedY());
            }
            else {
                enemy.setX(enemy.getX() + enemy.getSpeedX());
                enemy.setY(enemy.getY() - enemy.getSpeedY());
            }
        }
        else if (enemy.getWall() == 1) {
            if (enemy.getDestinationY() >= enemy.getY()) {
                enemy.setX(enemy.getX() - enemy.getSpeedX());
                enemy.setY(enemy.getY() + enemy.getSpeedY());

            }
            else {
                enemy.setX(enemy.getX() - enemy.getSpeedX());
                enemy.setY(enemy.getY() - enemy.getSpeedY());

            }
        }
        else if (enemy.getWall() == 2) {
            if (enemy.getDestinationX() >= enemy.getX()) {
                enemy.setX(enemy.getX() + enemy.getSpeedX());
                enemy.setY(enemy.getY() + enemy.getSpeedY());
            }
            else {
                enemy.setX(enemy.getX() - enemy.getSpeedX());
                enemy.setY(enemy.getY() + enemy.getSpeedY());
            }
        }
        else if (enemy.getWall() == 3) {
            if (enemy.getDestinationX() >= enemy.getX()) {
                enemy.setX(enemy.getX() + enemy.getSpeedX());
                enemy.setY(enemy.getY() - enemy.getSpeedY());
            }
            else {
                enemy.setX(enemy.getX() - enemy.getSpeedX());
                enemy.setY(enemy.getY() - enemy.getSpeedY());
            }
        }

        if (enemy.getX() < -100 || enemy.getX() > rangeX || enemy.getY() < -100 || enemy.getY() > rangeX) {
            enemys.splice(k, 1);
        }

    }
}

function renderStraightEnemys() {
    for (let j = 0; j < straightEnemys.length; j++) {
        let straightEnemy = straightEnemys[j];
        ctx.beginPath();
        ctx.fillStyle = straightEnemy.getColor();
        ctx.arc(straightEnemy.getX(), straightEnemy.getY(), straightEnemy.getRadius(), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

    }
    for (let k = 0; k < straightEnemys.length; k++) {
        let straightEnemy = straightEnemys[k];
        var distanceX = Math.abs(straightEnemy.getDestinationX() - straightEnemy.getInitialX());
        var distanceY = Math.abs(straightEnemy.getDestinationY() - straightEnemy.getInitialY());
        var speedY = distanceY / straightEnemy.getAliveTime() / 1.5;
        var speedX = distanceX / straightEnemy.getAliveTime() / 1.5;
        if (straightEnemy.getWall() == 0) {//leftSide
            if (straightEnemy.getDestinationY() >= straightEnemy.getY()) {
                straightEnemy.setX(straightEnemy.getX() + speedX);
                straightEnemy.setY(straightEnemy.getY() + speedY);
            }
            else {
                straightEnemy.setX(straightEnemy.getX() + speedX);
                straightEnemy.setY(straightEnemy.getY() - speedY);
            }
        }
        else if (straightEnemy.getWall() == 1) {
            if (straightEnemy.getDestinationY() >= straightEnemy.getY()) {
                straightEnemy.setX(straightEnemy.getX() - speedX);
                straightEnemy.setY(straightEnemy.getY() + speedY);

            }
            else {
                straightEnemy.setX(straightEnemy.getX() - speedX);
                straightEnemy.setY(straightEnemy.getY() - speedY);

            }
        }
        else if (straightEnemy.getWall() == 2) {
            if (straightEnemy.getDestinationX() >= straightEnemy.getX()) {
                straightEnemy.setX(straightEnemy.getX() + speedX);
                straightEnemy.setY(straightEnemy.getY() + speedY);
            }
            else {
                straightEnemy.setX(straightEnemy.getX() - speedX);
                straightEnemy.setY(straightEnemy.getY() + speedY);
            }
        }
        else if (straightEnemy.getWall() == 3) {
            if (straightEnemy.getDestinationX() >= straightEnemy.getX()) {
                straightEnemy.setX(straightEnemy.getX() + speedX);
                straightEnemy.setY(straightEnemy.getY() - speedY);
            }
            else {
                straightEnemy.setX(straightEnemy.getX() - speedX);
                straightEnemy.setY(straightEnemy.getY() - speedY);
            }
        }

        if (straightEnemy.getX() < -100 || straightEnemy.getX() > rangeX || straightEnemy.getY() < -100 || straightEnemy.getY() > rangeX) {
            straightEnemys.splice(k, 1);
        }
    }
}


function renderItems() {
    for (let j = 0; j < items.length; j++) {
        let item = items[j];
        if (item.getName() == "coffee") {
            ctx.beginPath();
            ctx.fillStyle = item.getColor("coffee");
            ctx.arc(item.getX(), item.getY(), item.getRadius(), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();


            ctx.beginPath();
            ctx.font = '15px Arial';
            ctx.fillStyle = '#6f4e37';
            ctx.fillText(`ITEM_COFFEE`, item.getX() - item.getRadius() - 20, item.getY() - item.getRadius());
            ctx.closePath();
        }
        else if (item.getName() == "hotsix") {
            ctx.beginPath();
            ctx.fillStyle = item.getColor("hotsix");
            ctx.arc(item.getX(), item.getY(), item.getRadius(), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.font = '15px Arial';
            ctx.fillStyle = '#0067a3';
            ctx.fillText(`ITEM_HOTSIX`, item.getX() - item.getRadius() - 20, item.getY() - item.getRadius());
            ctx.closePath();
        }

    }
    for (let k = 0; k < items.length; k++) {
        let item = items[k];
        var distanceX = Math.abs(item.getDestinationX() - item.getInitialX());
        var distanceY = Math.abs(item.getDestinationY() - item.getInitialY());
        var speedY = distanceY / item.getAliveTime();
        var speedX = distanceX / item.getAliveTime();
        if (item.getWall() == 0) {//leftSide
            if (item.getDestinationY() >= item.getY()) {
                item.setX(item.getX() + speedX);
                item.setY(item.getY() + speedY);
            }
            else {
                item.setX(item.getX() + speedX);
                item.setY(item.getY() - speedY);
            }
        }
        else if (item.getWall() == 1) {
            if (item.getDestinationY() >= item.getY()) {
                item.setX(item.getX() - speedX);
                item.setY(item.getY() + speedY);
            }
            else {
                item.setX(item.getX() - speedX);
                item.setY(item.getY() - speedY);

            }
        }
        else if (item.getWall() == 2) {
            if (item.getDestinationX() >= item.getX()) {
                item.setX(item.getX() + speedX);
                item.setY(item.getY() + speedY);
            }
            else {
                item.setX(item.getX() - speedX);
                item.setY(item.getY() + speedY);
            }
        }
        else if (item.getWall() == 3) {
            if (item.getDestinationX() >= item.getX()) {
                item.setX(item.getX() + speedX);
                item.setY(item.getY() - speedY);

            }
            else {
                item.setX(item.getX() - speedX);
                item.setY(item.getY() - speedY);
            }
        }

        if (item.getX() < -100 || item.getX() > rangeX || item.getY() < -100 || item.getY() > rangeX) {
            items.splice(k, 1);
        }
    }
}

let timer = 15.00;
let score = 0;
function renderTimer() {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(`Timer ${timer.toFixed(2)}`, 30, 50);
    ctx.fillText(`Score ${score.toFixed(2)}`, 30, 70);
    ctx.closePath();

}

function renderClearMessage() {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.fillText(`Stage ${stage - 1} Clear!!`, canvasWidth / 2 - 150, canvasHeight - 80);
    ctx.fillText(`The next stage will start shortly.`, canvasWidth / 2 - 350, canvasHeight - 30);
    ctx.closePath();
}



function renderGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    collisionDetection();
    renderStage();
    renderPlayers();
    renderEnemys();
    renderStraightEnemys();
    renderItems();
    renderTimer();

    if (stageClear) {
        renderClearMessage();
    }
    acquireDetection();
    if (coffeeEffect) {
        enemys.length = 0;
        straightEnemys.length = 0;
        items.length = 0;
        coffeeEffect = false;
    }

    if (balls.length) {
        sendData();
    }
    if (isStart) {
        timer -= 0.010;
        score += 0.010;
        if (parseInt(timer) <= 0) {
            timer = 0;
        }
    }
    renderTimer();
}

var isStart = false;

function update() {
    renderGame();
}

setInterval(update, 10);

function start() {
    if (!isStart) {
        socket.emit('start', { id: myId, stage: stage, waiting: false, isStart: true });
    }
}

socket.on('start_game', function () {
    isStart = true;
    let bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    bgm.play();
    if(stage % 2 == 0){ //살아있는 유저의 진영 count값에 따라서
      let bgm = document.getElementById("bgm2");
      bgm.volume = 0.3;
      bgm.play();
    }
})
let stageClear = false;
socket.on('stage_clear', function (data) {//스테이지 하나가 끝난 상태
    stageClear = true;
    enemys.length = 0;
    straightEnemys.length = 0;
    items.length = 0;
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].getState() == 0) {
            balls[i].setX(canvasWidth / 2);
            balls[i].setY(canvasHeight / 2);
            balls[i].setState(1);
        }
    }

    isStart = false;
    socket.emit('start', { id: myId, stage: stage, waiting: true });//웨이팅 스테이지로 이동
    stage = data.stage;//스테이지 1 업 시켜주기
})
socket.on('end_waiting', function () {//웨이팅이 끝난상태
    timer = 15;
    stageClear = false;
    isStart = false;
    socket.emit('start', { id: myId, stage: stage, waiting: false });
})
