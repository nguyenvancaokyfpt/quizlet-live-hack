let terms = [];
let definitions = [];
let qs = "";
let autoClick = false;
let color = true;
let menu = true;

document.addEventListener("keydown", function (event) {
  if (event.code == "Enter") {
    Turn_on_hack();
    showStatus();
  }
  if (event.code == "KeyX") {
    autoClick = !autoClick;
    showStatus();
  }
  if (event.code == "KeyZ") {
    color = !color;
    getCorrect();
    showStatus();
  }
  if (event.code == "KeyC") {
    menu = !menu;
    if (menu) {
      $("#menu").css("display", "block");
    } else {
      $("#menu").css("display", "none");
    }
  }
});

$(document).ready(function () {});

function Turn_on_hack() {
  getQuizletCode(inputCode());
}

function showStatus() {
  let log = "AUTO: " + autoClick + " |  COLOR: " + color;
  $("#log").text(log);
  console.log(log);
}

function Log(content) {
  $("#log").text(content);
  console.log(content);
}

function inputCode() {
  let code = [];
  for (var i = 0; i < 6; i++) {
    code[i] = $(".StudentGameCodeInput-inner input:eq(" + i + ")").val();
  }
  let strCode = code.toString();
  strCode = strCode.split(",").join("");
  let log = "GET INPUT ----> " + strCode;
  Log(log);
  return strCode;
}

function getQuizletCode(code) {
  fetch(
    `https://quizlet.com/webapi/3.8/multiplayer/game-instance?gameCode=` + code
  )
    .then((e) => e.text())
    .then((stuff) => {
      stuff = JSON.parse(stuff);
      stuff = stuff.gameInstance.itemId;
      window.quizletCode = stuff;
      let log = "GET CODE ----> " + stuff;
      Log(log);
      appendJson();
    });
}

function getAnswer() {
  result = JSON.parse($("#answerJson").text());
  window.questions = result;
  let log = "LOAD JSON ----> 100%";
  Log(log);
  parseQuestions();
}

function appendJson() {
  $("#answerJson").remove();
  fetch(`https://quizlet.com/` + window.quizletCode + `/`)
    .then((e) => e.text())
    .then((stuff) => {
      let log = "LOAD ANSWER ----> 100%";
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
    });
}

function parseQuestions() {
  let q = window.questions;
  let qKeys = Object.keys(q);
  terms = [];
  definitions = [];
  for (let x = 0; x < qKeys.length; x++) {
    terms.push(q[qKeys[x]].word);
    definitions.push(q[qKeys[x]].definition);
  }
  setInterval(waitForChange, 100);
  showStatus();
}

function waitForChange() {
  setTimeout(function () {
    let cQ = $(".FormattedText.notranslate.StudentPrompt-text div").text();
    if (qs != cQ) {
      getCorrect();
      qs = cQ;
    }
  }, 100);
}

function changeColor(n, c) {
  if (color) {
    $(
      ".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq(" +
        n +
        ")"
    ).css("color", c);
  } else {
    $(
      ".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq(" +
        n +
        ")"
    ).css("color", "black");
  }
}

function getCorrect() {
  let currentQ = $(".FormattedText.notranslate.StudentPrompt-text div").text();
  let answers = $(
    ".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText"
  );
  let txt = [];
  for (let x = 0; x < answers.length; x++) {
    txt.push(answers[x].textContent);
  }
  flipped = false;
  if (terms.indexOf(currentQ) === -1) {
    termsQ = terms;
    terms = definitions;
    definitions = termsQ;
  }
  let int = txt.indexOf(definitions[terms.indexOf(currentQ)]);
  for (let x = 0; x < answers.length; x++) {
    changeColor(x, "red");
  }
  try {
    if (int != -1) {
      changeColor(int, "lime");
      if (autoClick) {
        $(
          ".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq(" +
            int +
            ")"
        ).click();
      }
    }
  } catch (err) {
    getCorrect();
  }
}
