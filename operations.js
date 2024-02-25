const startButton = document.getElementById('btnStart');
const btnReset = document.getElementById('btnReset');
const divCountDown = document.getElementById("second-panel-1-1");
const cmbLang = document.getElementById('cmbLang');
const cmbLetters = document.getElementById('cmbLetters');
const txtWords = document.getElementById('txtWords');
const summaryPanel = document.getElementById('summary-panel');
const maxTime = 60; //seconds

var startDate = new Date();
var foundedWordsCount = 0;
var summaryHeader = "";
var timer = null;
var currentList = [];

var expired = "";
var listening = "";
var start = "";


const divIntro = document.getElementById('upper-left');
const resources = getResources();


const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = getLanguage(parseInt(cmbLang.value));  //'fr-fr'; //'he-is'; //'ru-ru'; //'en-US';

recognition.onstart = () => {
    startButton.value = listening;
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;    
    getWord(transcript);
};

recognition.onend = () => {
    
    if (checkTime())
        continueRecognition();
};

startButton.addEventListener('click', () => {
   startRecognition();
});

btnReset.addEventListener('click', () => {
    reset();
});

cmbLang.addEventListener('change', () => {
    reset();
    recognition.lang = getLanguage(parseInt(cmbLang.value));
    getResources();
});

function getLanguage(val) {
    let result = "";
    switch (val) {
        case 1:
            result = 'ru-ru';
            break;
        case 2:
            result = 'en-US';
            break;
        case 3:
            result = 'he-is';
            break;
        case 4:
            result = 'fr-fr';
            break;
    }
    return result;
}

function getResources() {
    let val = parseInt(cmbLang.value);
    let obj=null
    switch (val) {
        case 1:
            obj= russianResource;           
            break;
        case 2:
            obj = englishResource;
            break;
        case 3:
            obj = hebrewResource;
            break;
        case 4:
            obj = frenchResource;
            break;
    }
    divIntro.innerHTML = obj.introduction;
    if (val == 3)
        divIntro.style.direction = "rtl";
    else
        divIntro.style.direction = "ltr";
    cmbLetters.innerHTML = "";
    let letters = obj.letters.split(",");
    for (var i = 0; i < letters.length; i++) {
        let opt = document.createElement("OPTION");       
        opt.setAttribute("value", letters[i]);
        let t = document.createTextNode(letters[i]);
        opt.appendChild(t);        
        cmbLetters.appendChild(opt);
    }
    startButton.value = obj.start;
    btnReset.value = obj.reset;
    summaryHeader = obj.summary;
    summaryPanel.innerHTML = obj.summary;
    expired = obj.expired;
    listening = obj.listening;
    start = obj.start;
}
function startRecognition() {
    reset(); //clear   
    startCountDown();
    try {
        recognition.start();
    } catch (e) {

    }
    
}
function continueRecognition() {   
    recognition.start();
}
function reset() {
    recognition.stop();
    clearInterval(timer);
    timer = null;
    foundedWordsCount = 0;
    txtWords.value = "";
    divCountDown.innerHTML =  "01:00";
    summaryPanel.innerHTML = summaryHeader;
    startButton.value = start;
    currentList = [];
}
function getWord(word) {
    if (word.length > 0) {
        if (currentList.includes(word))
            return;
        let firstLetter = cmbLetters.value;
        if (word[0] == firstLetter) {
            txtWords.value += word + "\n";
            foundedWordsCount++;
            currentList.push(word);
        }
    }
}
function checkTime() {
    if (timer == null)
        return false
    else
        return true;    
}
function startCountDown() {
    startDate = new Date();
    startDate.setSeconds(startDate.getSeconds() + maxTime);

    // Update the count down every 1 second
    timer = setInterval(function () {
        
        // Get today's date and time
        var now = new Date().getTime();
        
        // Find the distance between now and the count down date
        var distance = startDate - now;

        // Time calculations for days, hours, minutes and seconds
        //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        //var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        //var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        divCountDown.innerHTML = seconds + " ";

        // If the count down is finished, write some text
        if (distance < 0) {
            recognition.abort();
            clearInterval(timer);
            timer = null;
            divCountDown.innerHTML = expired;
            summaryPanel.innerHTML += foundedWordsCount + "";
            startButton.value = start;
        }
    }, 500);
}