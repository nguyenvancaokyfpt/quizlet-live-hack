let terms = [];
let definitions = [];
let q = '';
let autoClick = localStorage.getItem("autoClick");
let color = localStorage.getItem("color");
let menu = localStorage.getItem("menu");

document.addEventListener('keydown', function(event) {
  if (event.code == 'Enter') {
    Turn_on_hack();
    showStatus();
  }
  if (event.code == 'KeyX' && (event.ctrlKey || event.metaKey)) {
    autoClick = !autoClick;
    localStorage.setItem("autoClick", autoClick);
    showStatus();
  }
  if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
    color = !color;
    localStorage.setItem("color", color);
    getCorrect();
    showStatus();
  }
  if (event.code == 'KeyC') {
  	menu = !menu;
  	localStorage.setItem("menu", menu);
  	if (menu) {
  		$('#menu').css('display','block');
  	} else {
  		$('#menu').css('display','none');
  	}
  }
});

$(document).ready(function() {
});


function Turn_on_hack(){
	getQuizletCode(inputCode());
}

function showStatus(){
	let log = 'AUTO: ' + autoClick + ' |  COLOR: ' + color;
	$('#log').text(log);
	console.log(log);
}

function Log(content){
	$('#log').text(content);
	console.log(content);
}

function inputCode(){
	let code = [];
	for (var i = 0; i < 6; i++) {
		code[i] = $('.StudentGameCodeInput-inner input:eq('+i+')').val();
	}
	let strCode = code.toString();
	strCode = strCode.split(',').join('');
	let log = 'GET INPUT ----> ' + strCode;
	Log(log);
	return strCode;
}

function getQuizletCode(code){
	fetch(`https://quizlet.com/webapi/3.2/game-instances?filters={"gameCode":`+code+`,"isInProgress":true,"isDeleted":false}&perPage=500`)
        .then(e => e.text())
        	.then(stuff => {
        		stuff = JSON.parse(stuff);
        		stuff = stuff.responses[0].models.gameInstance[0].itemId;
        		window.quizletCode = stuff;
        		let log = 'GET CODE ----> ' + stuff;
				Log(log);
				appendJson();
   		});
}

function getAnswer(){
	result = JSON.parse($("#answerJson").text());
	window.questions = result;
	let log = 'LOAD JSON ----> 100%';
	Log(log);
	parseQuestions();
}

function appendJson() {
	$("#answerJson").remove();
    fetch(`https://quizlet.com/`+window.quizletCode+`/`)
        .then(e => e.text())
        .then(stuff => {
        let log = 'LOAD ANSWER ----> 100%';
		Log(log);
        let split = stuff.split("<script");
        split = split[split.length - 6];
        split = split.split("/script>")[0];
        split = split.split("QLoad(")[0];
        split = split.split(`(function(){window.Quizlet["setPageData"] = `)[1];
        split = split.slice(0, -2);
        split = JSON.parse(split);
        split = split.termIdToTermsMap;
        split = JSON.stringify(split);
        var divBlock = "<div style='display:none' id='answerJson'></div>";
        $("body").append(divBlock);
        $("#answerJson").append(split);
        getAnswer();
    })
}

function parseQuestions() {
  let q = window.questions;
  let qKeys = Object.keys(q);
  terms = [];
  definitions = [];
  for(let x=0;x<qKeys.length;x++) {
    terms.push(q[qKeys[x]].word);
    definitions.push(q[qKeys[x]].definition);
  }
  setInterval(waitForChange, 50);
  showStatus();
}

function waitForChange(){
	let cQ = $(".FormattedText.notranslate.StudentPrompt-text div").text();
	if (window.q != cQ) {
		getCorrect();
		window.q = cQ;
	}
}

function changeColor(n,c){
	if (color) {
  		$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+n+")").css('color',c);
  	} else {
  		$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+n+")").css('color','black');
  	}
}

function getCorrect() {
  let currentQ = $(".FormattedText.notranslate.StudentPrompt-text div").text();
  let answers = $(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText");
  let txt = [];
  for(let x=0;x<answers.length;x++) {
    txt.push(answers[x].textContent);
  }
  flipped = false;
  if(terms.indexOf(currentQ) === -1) {
    termsQ = terms
    terms = definitions
    definitions = termsQ
  }
  int = txt.indexOf(definitions[terms.indexOf(currentQ)]);
  for(let x=0;x<answers.length;x++) {
	changeColor(x,'red');
  }
  try {
	changeColor(int,'lime');
    if (autoClick) {
    	$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+int+")").click();
    }
  }catch(err){getCorrect();}
}