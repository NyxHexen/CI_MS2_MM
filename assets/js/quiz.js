const quizModalContainer = document.querySelector('.quiz-start-container');
const quizModal = document.querySelector('.quiz-start-box');
const quizInput = document.querySelector('#quiz-name');
const quizSubmit = document.querySelector('.quiz-submit');
const quizContainer = document.querySelector('.quiz-container');
const countdownDiv = document.querySelector('#countdown');
const quizQuestion = document.querySelector('.question');
const quizAnswersBtn = document.querySelectorAll('.answer');
const quizAnswersText = document.querySelectorAll('.answer span');
const hudTimer = document.querySelector('.timer');

let shuffledQuestions, shuffledAnswers, currentQuestion;
let answeredQuestions = [];
const availQuestions = [{
    question: "What is 2 + 2?",
    answers: [{
        correct: true,
        answer: "4"
    }, {
        answer: "3"
    }, {
        answer: "2"
    }, {
        answer: "1"
    }]
}, {
    question: "What is the correct formula for finding the circumference of a circle",
    answers: [{
        correct: true,
        answer: "C = 2 π r"
    }, {
        answer: "23"
    }, {
        answer: "32"
    }, {
        answer: "24"
    }]
}, {
    question: "What is 10 + 10?",
    answers: [{
        correct: true,
        answer: "20"
    }, {
        answer: "23"
    }, {
        answer: "62"
    }, {
        answer: "42"
    }]
}, {
    question: "What is the correct formula for finding the area of an equilateral triangle?",
    answers: [{
        correct: true,
        answer: "A = (√3)/4 x side"
    }, {
        answer: "What is a triangle?"
    }, {
        answer: "34"
    }, {
        answer: "24"
    }]
}]

const player = {
    name: 0,
    score: 0,
    multiplier: 1,
    guesses: 0
}

quizInput.addEventListener('input', () => {
    if (quizInput.value.length > 2) {
        quizSubmit.disabled = false;
    }
});

quizSubmit.addEventListener('click', () => {
    player.name = quizInput.value;
    quizModalContainer.classList.add('active');
    setTimeout(quizStart, 1000);
})

function quizStart() {
    player.score = 0;
    player.guesses = 0;

    //https://stackoverflow.com/questions/50190639/trying-to-create-a-numeric-3-2-1-countdown-with-javascript-and-css
    function countdown(parent, callback) {
        function count() {
            if (numDiv) {
                numDiv.remove();
            }

            if (numbers.length === 0) {
                clearInterval(interval);
                callback();
                return;
            }

            let number = numbers.shift();
            numDiv = document.createElement('p');
            numDiv.textContent = number;
            numDiv.className = "num";

            parent.appendChild(numDiv);
        }
        let numbers = [3, 2, 1];
        let numDiv = null;
        var interval = setInterval(count, 1000);
    }
    countdown(countdownDiv, function () {
        countdownDiv.innerHTML = '<p class="num">START!</p>';
        setTimeout(() => {
            countdownDiv.style.transform = "scaleY(0)";
            showQuestion();
        }, 1500);
    });
};

function shuffle(array) {
    array.sort(() => Math.random() - .5);
    return array;
}

function clearStatusClass(array){
    array.forEach(item => {
        item.classList.remove('unset');
        item.classList.remove('set');
        item.classList.remove('disabled');
        item.classList.remove('correct');
        item.classList.remove('incorrect');
        delete item.dataset['correct'];
    })
}

function showQuestion() {
    shuffledQuestions = shuffle(availQuestions);
    currentQuestion = shuffledQuestions.shift();
    answeredQuestions.push(currentQuestion);
    quizQuestion.innerText = currentQuestion.question;

    shuffledAnswers = shuffle(currentQuestion.answers);

    clearStatusClass(quizAnswersBtn);
    for (let i = 0; i < quizAnswersText.length; i++) {
        quizAnswersText[i].innerText = shuffledAnswers[i].answer;
        if (shuffledAnswers[i].hasOwnProperty('correct')) {
            quizAnswersText[i].parentElement.dataset.correct = true;
        }
        quizAnswersText[i].parentElement.classList.add('set');
        quizAnswersText[i].parentElement.addEventListener('click', selectAnswer);
    }
    startTimer()
}

let timerId;

function startTimer(){
    let timeLeft = 30;
    timerId = setInterval(tickTock, 1000);
    function tickTock() {
        if (timeLeft === -1){
            showQuestion();
        } else {
            hudTimer.innerHTML = timeLeft;
            timeLeft--;
        }
    }
}

function stopTimer(timer){
    clearInterval(timer);
}

function setNextQuestion() {
    showQuestion();
}

function selectSiblings(array, skipThis) {
    let arr = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != skipThis) {
            arr.push(array[i]);
        }
    }
    return arr;
}

function selectAnswer(e) {
    stopTimer(timerId);
    const selectedAnswer = e.target;
    selectSiblings(quizAnswersBtn, selectedAnswer).forEach(btn => {
        btn.classList.add('disabled');
    })
    if (selectedAnswer.dataset.correct) {
        selectedAnswer.classList.add('correct');
    } else {
        selectedAnswer.classList.add('incorrect');
    }
    setTimeout(() => {
        quizAnswersBtn.forEach(btn => {
            btn.classList.add('unset');
        })
        setTimeout(showQuestion, 1000);
    }, 1000);
}