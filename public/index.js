var pageChange = false;

function draw() {
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var first_game = {
        x: 50,
        y: 40,
        width: 70,
        height: 50,
        draw() {
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    var dino = {
        x: 300,
        y: 200,
        width: 30,
        height: 30,
        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    function move() {
        animation = requestAnimationFrame(move);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dino.draw()
        first_game.draw()

        var x1 = dino.x - (first_game.x + first_game.width);
        var x2 = (dino.x + dino.width) - first_game.x;
        var y1 = dino.y - (first_game.y + first_game.height);
        var y2 = (dino.y + dino.height) - first_game.y;
        if (rightPressed) {
            dino.x += 2
        }
        if (leftPressed) {
            dino.x -= 2
        }
        if (downPressed) {
            dino.y += 2
        }
        if (upPressed) {
            dino.y -= 2
        }

        if ((x1 <= 0) && (y1 < 0) && (x2 > 0) && (y2 > 0)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pageChange = true
        }


    }
    move()

    var rightPressed = false;
    var leftPressed = false;
    var downPressed = false;
    var upPressed = false;

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

if (pageChange) {
    document.getElementById("contentFrame").setAttribute("src", 'game1.html')
}
