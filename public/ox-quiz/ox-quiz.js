var number_id, problem_id, answer_id;
var problem_arr = ['달팽이도 이빨이 있다.', '뱀은 뒤로 갈 수 있다.', '퀴리부인은 노벨상을 두 번 수상했다.', ' 피를 빨아먹는 모기는 암컷이다.', '물고기도 귀가 있다.', '수고하셨습니다!!'];
var answer_arr = ['O', 'X', 'O', 'X', 'O'];

var selectAnswer, score;
var imgNum, startNum, endNum;
let bgm = document.getElementById("bgm");
// bgm.volume = 0.3;
// bgm.play();

function init() {
	number_id = document.getElementById("number_id");
	problem_id = document.getElementById("problem_id");
	answer_id = document.getElementById("answer_id");

	startNum = 0;
	endNum = 5;
	score = 0;

	setProblem();
}

function setProblem() {
	problem_id.innerHTML = "<div style='width:400px; height: 200px; font-size: 25px; display: flex; justify-content: center; align-items: center;'>" + problem_arr[startNum] + "</div >";

	if (startNum == endNum) {
		number_id.innerHTML = "<span class='label'>< 결과보기 ></span>";
		answer_id.innerHTML = "<button type='button' class='button res' onclick='btnResFunc();'>결과보기</button><button type='button' class='button restart' onclick='history.go(0);'>다시하기</button>";
	} else {
		number_id.innerHTML = "<span class='label'>< " + parseInt(startNum + 1) + " ></span>";
		answer_id.innerHTML = "<button type='button' class='button o' onclick='btnOFunc();'>O</button><button type='button' class='button x' onclick='btnXFunc();'>X</button>";
	}
}

init();


function btnOFunc() {
	selectAnswer = "O";
	if (answer_arr[startNum] == selectAnswer) {
		score++;
	}
	startNum++;
	setProblem();
}

function btnXFunc() {
	selectAnswer = "X";
	if (answer_arr[startNum] == selectAnswer) {
		score++;
	}
	startNum++;
	setProblem();
}

function btnResFunc() {
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