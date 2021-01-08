// ==UserScript==
// @name         Live Hack Quizlet
// @namespace    Nguyễn Văn Cao Kỳ
// @description  :)
// @author       Nguyễn Văn Cao Kỳ
// @include      *quizlet.com/live*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        none
// @version      1.0.1
// @copyright    2021, nguyenvancaoky (https://fb.me/nguyenvancaoky)
// @license MIT
// ==/UserScript==


appendMenu();
appendFunc();

function appendMenu(){
        var divBlock = `<div style="z-index: 99999;position: absolute;right: 8px;bottom: 8px;width: 230px;height: 35px;background-color: #d9dde8;border-radius: 6px;" id="menu"><p style=" font-size: 13px; color: rebeccapurple; padding: 8px 10px; text-align: center; " id="log"></p></div>`;
        $("body").append(divBlock);
}
function appendFunc(){
  var func = document.createElement("script");
  func.innerHTML = `let terms=[],definitions=[],qs="",autoClick=!1,color=!0,menu=!0;function Turn_on_hack(){getQuizletCode(inputCode())}function showStatus(){let t="AUTO: "+autoClick+" |  COLOR: "+color;$("#log").text(t),console.log(t)}function Log(t){$("#log").text(t),console.log(t)}function inputCode(){let t=[];for(var e=0;e<6;e++)t[e]=$(".StudentGameCodeInput-inner input:eq("+e+")").val();let n=t.toString();return Log("GET INPUT ----\x3e "+(n=n.split(",").join(""))),n}function getQuizletCode(t){fetch('https://quizlet.com/webapi/3.2/game-instances?filters={"gameCode":'+t+',"isInProgress":true,"isDeleted":false}&perPage=500').then(t=>t.text()).then(t=>{t=(t=JSON.parse(t)).responses[0].models.gameInstance[0].itemId,window.quizletCode=t,Log("GET CODE ----\x3e "+t),appendJson()})}function getAnswer(){result=JSON.parse($("#answerJson").text()),window.questions=result;Log("LOAD JSON ----\x3e 100%"),parseQuestions()}function appendJson(){$("#answerJson").remove(),fetch("https://quizlet.com/"+window.quizletCode+"/").then(t=>t.text()).then(t=>{Log("LOAD ANSWER ----\x3e 100%");let e=t.split("<script");e=(e=(e=(e=(e=e[e.length-6]).split("/script>")[0]).split("QLoad(")[0]).split('(function(){window.Quizlet["setPageData"] = ')[1]).slice(0,-2),e=(e=JSON.parse(e)).termIdToTermsMap,e=JSON.stringify(e);$("body").append("<div style='display:none' id='answerJson'></div>"),$("#answerJson").append(e),getAnswer()})}function parseQuestions(){let t=window.questions,e=Object.keys(t);terms=[],definitions=[];for(let n=0;n<e.length;n++)terms.push(t[e[n]].word),definitions.push(t[e[n]].definition);setInterval(waitForChange,100),showStatus()}function waitForChange(){let t=$(".FormattedText.notranslate.StudentPrompt-text div").text();qs!=t&&(getCorrect(),qs=t)}function changeColor(t,e){color?$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+t+")").css("color",e):$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+t+")").css("color","black")}function getCorrect(){let t=$(".FormattedText.notranslate.StudentPrompt-text div").text(),e=$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText"),n=[];for(let t=0;t<e.length;t++)n.push(e[t].textContent);flipped=!1,-1===terms.indexOf(t)&&(termsQ=terms,terms=definitions,definitions=termsQ);let o=n.indexOf(definitions[terms.indexOf(t)]);for(let t=0;t<e.length;t++)changeColor(t,"red");try{-1!=o&&(changeColor(o,"lime"),autoClick&&$(".StudentAnswerOptions .StudentAnswerOptions-optionCard .FormattedText:eq("+o+")").click())}catch(t){getCorrect()}}document.addEventListener("keydown",function(t){"Enter"==t.code&&(Turn_on_hack(),showStatus()),"KeyX"==t.code&&(autoClick=!autoClick,showStatus()),"KeyZ"==t.code&&(color=!color,getCorrect(),showStatus()),"KeyC"==t.code&&((menu=!menu)?$("#menu").css("display","block"):$("#menu").css("display","none"))}),$(document).ready(function(){});`;
  $("body").append(func);
  console.log('INJECTED HACK ----> OK')
}
