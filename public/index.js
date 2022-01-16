function draw() {
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');


    var houseNone = new Image();
    houseNone.src = 'houseNone.png';

    var house10 = {
        x: 150,
        y: 100,
        width: 100,
        height: 130,
        draw() {
            ctx.drawImage(houseNone, this.x - 50, this.y - 50)
        }
    }
    var house11 = {
        x: 550,
        y: 100,
        width: 100,
        height: 130,
        draw() {
            ctx.drawImage(houseNone, this.x - 50, this.y - 50)
        }
    }
    var house12 = {
        x: 950,
        y: 100,
        width: 100,
        height: 130,
        draw() {
            ctx.drawImage(houseNone, this.x - 50, this.y - 50)
        }
    }
    var house13 = {
        x: 450,
        y: 500,
        width: 100,
        height: 130,
        draw() {
            ctx.drawImage(houseNone, this.x - 50, this.y - 50)
        }
    }
    var house14 = {
        x: 1050,
        y: 500,
        width: 100,
        height: 130,
        draw() {
            ctx.drawImage(houseNone, this.x - 50, this.y - 50)
        }
    }


    var houseRed = new Image();
    houseRed.src = 'houseRed.png';

    var house2 = {
        x: 400,
        y: 400,
        width: 25,
        height: 25,
        draw() {
            ctx.drawImage(houseRed, this.x, this.y)
        }
    }
    var houseBlue = new Image();
    houseBlue.src = 'houseBlue.png';

    var house3 = {
        x: 300,
        y: 400,
        width: 25,
        height: 25,
        draw() {
            ctx.drawImage(houseBlue, this.x, this.y)
        }
    }



    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        house10.draw();
        house11.draw();
        house12.draw();
        house13.draw();
        house14.draw();

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

        var h1x1 = dino.x - (house10.x + house10.width);
        var h1x2 = (dino.x + dino.width) - (house10.x + 25);
        var h1y1 = dino.y - (house10.y + house10.height);
        var h1y2 = (dino.y + dino.height) - (house10.y + 25);

        if ((h1x1 <= 0) && (h1y1 < 0) && (h1x2 > 0) && (h1y2 > 0)) {
            location.href = "/catchmind"

        }
        var h2x1 = dino.x - (house11.x + house11.width);
        var h2x2 = (dino.x + dino.width) - (house11.x + 25);
        var h2y1 = dino.y - (house11.y + house11.height);
        var h2y2 = (dino.y + dino.height) - (house11.y + 25);

        if ((h2x1 <= 0) && (h2y1 < 0) && (h2x2 > 0) && (h2y2 > 0)) {
            location.href = "/ox-quiz/"
        }
        var h3x1 = dino.x - (house12.x + house12.width);
        var h3x2 = (dino.x + dino.width) - (house12.x + 25);
        var h3y1 = dino.y - (house12.y + house12.height);
        var h3y2 = (dino.y + dino.height) - (house12.y + 25);

        if ((h3x1 <= 0) && (h3y1 < 0) && (h3x2 > 0) && (h3y2 > 0)) {
            location.href = "/dodging-professor/"
        }
        var h4x1 = dino.x - (house13.x + house13.width);
        var h4x2 = (dino.x + dino.width) - (house13.x + 25);
        var h4y1 = dino.y - (house13.y + house13.height);
        var h4y2 = (dino.y + dino.height) - (house13.y + 25);

        if ((h4x1 <= 0) && (h4y1 < 0) && (h4x2 > 0) && (h4y2 > 0)) {
            location.href = "/countingstar/"
        }
        var h5x1 = dino.x - (house14.x + house14.width);
        var h5x2 = (dino.x + dino.width) - (house14.x + 25);
        var h5y1 = dino.y - (house14.y + house14.height);
        var h5y2 = (dino.y + dino.height) - (house14.y + 25);

        if ((h5x1 <= 0) && (h5y1 < 0) && (h5x2 > 0) && (h5y2 > 0)) {
            console.log("채팅방에 입장하셨습니다.")
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