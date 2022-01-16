function draw() {
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var dino = {
        x: 300,
        y: 200,
        width: 25,
        height: 25,
        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    var Pstar = new Image();
    Pstar.src = 'Pstar.png';

    class Stars {
        constructor() {
            this.x = Math.floor(Math.random() * 1500);
            this.y = Math.floor(Math.random() * 650);
            this.width = 30;
            this.height = 30;
        }
        draw() {
            ctx.fillStyle = '#FFE200'
            // ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(Pstar, this.x, this.y)
        }
    }
    var rightPressed = false;
    var leftPressed = false;
    var downPressed = false;
    var upPressed = false;
    var timer = 0;
    var stars = [];
    var score = 1;
    function move() {
        animation = requestAnimationFrame(move);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dino.draw()
        ++timer;

        if (rightPressed) {
            dino.x += 8
        }
        if (leftPressed) {
            dino.x -= 8
        }
        if (downPressed) {
            dino.y += 8
        }
        if (upPressed) {
            dino.y -= 8
        }

        if (timer % 20 === 0) {
            var star = new Stars();
            stars.push(star)

        }



        stars.forEach((s, i, o) => {
            var x1 = dino.x - (s.x + s.width);
            var x2 = (dino.x + dino.width) - s.x;
            var y1 = dino.y - (s.y + s.height);
            var y2 = (dino.y + dino.height) - s.y;
            if ((x1 <= 0) && (y1 < 0) && (x2 > 0) && (y2 > 0)) {
                o.splice(i, 1)
                var newScore = score++;
                document.getElementById("score").innerText = newScore
            }
            s.draw();
        })
    }
    move()

    document.addEventListener('keydown', function (e) {
        if (e.code == 'ArrowRight') {
            rightPressed = true;

        }
        if (e.code == 'ArrowLeft') {
            leftPressed = true;
        }
        if (e.code == "ArrowDown") {
            downPressed = true;
        }
        if (e.code == "ArrowUp") {
            upPressed = true;
        }
    })
    document.addEventListener('keyup', function (e) {
        if (e.code == 'ArrowRight') {
            rightPressed = false;
        }
        if (e.code == 'ArrowLeft') {
            leftPressed = false;
        }
        if (e.code == "ArrowDown") {
            downPressed = false;
        }
        if (e.code == "ArrowUp") {
            upPressed = false;
        }
    })
}
