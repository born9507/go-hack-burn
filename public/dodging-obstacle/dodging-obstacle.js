function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 20;


  //공룡 이미지 그려주기
  var img2 = new Image();
  img2.addEventListener('load', function () {
      //   ctx.drawImage(img2, (x좌표)this.x, this.y)
  }, false);
  img2.src = 'trex.png';

  //등장 캐릭터의 속성 정리
  var dino = {
      x: 10,
      y: 200, //공룡 등장 좌표
      width: 30,
      height: 30, //공룡 폭과 높이
      draw() {
          ctx.fillStyle = 'green';
          ctx.fillRect(this.x, this.y, this.width, this.height);
          //   ctx.drawImage(img2, width=100, height=50, this.x, this.y);
      }
  }





  //장애물 이미지 그려주기

  var img1 = new Image();
  img1.addEventListener('load', function () {
      //   ctx.drawImage(img1, this.x, this.y)
  }, false);
  img1.src = 'cactus.png';


  //장애물 class
  class Cactus {
      constructor() {
          this.x = 500;
          this.y = 200;
          this.width = 50;
          this.height = 50;
      }
      draw() {
          ctx.fillStyle = 'black';
          ctx.fillRect(this.x, this.y, this.width, this.height);
          //   ctx.drawImage(img1, this.x, this.y)
      }
  }

  var cactus = new Cactus();
  cactus.draw()




  //점수 그려주기
  function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Score: " + score, 8, 20);
  }

  drawScore();


  var timer = 0;
  var cactusPlus = [];
  var jumpTimer = 0;
  var animation;
  var score = 0;



  function move() {
      animation = requestAnimationFrame(move);
      timer++;
      //draw 지우기
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //120 프레임마다 = 1초에 120번 실행(모니터 성능에따라다르다)
      if (timer % 200 === 0) {
          var cactus = new Cactus();
          //120프레임마다 장애물 추가해서 cactusPlus에 담김
          cactusPlus.push(cactus);
      }

      //배열 안 장애물 한꺼번에 관리
      cactusPlus.forEach((a, i, o) => {
          if (a.x < 0) {
              o.splice(i, 1) //배열에서 제거
          }
          a.x -= 3; //장애물속도

          collision(dino, a);

          a.draw();
      })

      //Jump
      if (jump == true) {
          dino.y -= 4; //점프속도
          jumpTimer++;
      }
      if (jump == false) {
          if (dino.y < 200) { //최저높이
              dino.y += 4;
          }
      }
      if (jumpTimer > 30 || dino.y > 400) { //체공시간
          jump = false;
          jumpTimer = 0;
      }
      dino.draw();
  }

  move();

  //Collision check
  function collision(dino, cactus) {
      var xdff = cactus.x - (dino.x + dino.width);
      var ydff = cactus.y - (dino.y + dino.height);
      if (xdff < 0 && ydff < 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cancelAnimationFrame(animation);
          alert('game over');
      }
  }

  var jump = false;
  document.addEventListener('keydown', function (e) {
      if (e.code === 'Enter') {
          jump = true;
      }
  })
}
