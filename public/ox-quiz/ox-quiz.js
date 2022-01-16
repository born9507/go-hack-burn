var number_id, problem_id, answer_id;
var problem_arr = ['q1.png', 'q2.png', 'q3.png', 'q4.png', 'q5.png', 'q6.png'];
var answer_arr = ['O', 'X', 'O', 'X', 'O'];

var selectAnswer, score;
var imgNum, startNum, endNum;

function init(){
  number_id = document.getElementById("number_id");
  problem_id = document.getElementById("problem_id");
  answer_id = document.getElementById("answer_id");

  startNum = 0;
  endNum = 5;
  score = 0;

  setProblem();
}

function setProblem(){
	problem_id.innerHTML = "<img src='/ox-quiz/images/" + problem_arr[startNum] + "' class='problem_img'>";

	if(startNum == endNum){
		number_id.innerHTML = "<span class='label'>< 결과보기 ></span>";
		answer_id.innerHTML = "<button type='button' class='button res' onclick='btnResFunc();'>결과보기</button><button type='button' class='button restart' onclick='history.go(0);'>다시하기</button>";
	} else {
		number_id.innerHTML = "<span class='label'>< " + parseInt(startNum + 1) + " ></span>";
		answer_id.innerHTML = "<button type='button' class='button o' onclick='btnOFunc();'>O</button><button type='button' class='button x' onclick='btnXFunc();'>X</button>";
	}
}
  
init();


function btnOFunc(){
	selectAnswer = "O";
	if(answer_arr[startNum] == selectAnswer){
		score++;
	}
	startNum++;
	setProblem();
}

function btnXFunc(){
	selectAnswer = "X";
	if(answer_arr[startNum] == selectAnswer){
		score++;
	}
	startNum++;
	setProblem();
}

function btnResFunc(){
    Swal.fire({
        title: '',
        text: '',
        html: "<b>당신의 점수는 " + score + "점입니다.</b>",
        icon: 'success',
        confirmButtonColor: '#d33',
        confirmButtonText: '닫기',
        allowOutsideClick: false
    })
}