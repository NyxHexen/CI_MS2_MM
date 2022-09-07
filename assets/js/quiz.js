const quizModalContainer = document.querySelector('.quiz-start-container');
const quizModal = document.querySelector('.quiz-start-box');
const quizInput = document.querySelector('#quiz-name');
const quizSubmit = document.querySelector('.quiz-submit');
const countdownDiv = document.querySelector('#countdown');
const quizQuestion = document.querySelector('.question');
const quizAnswersBtn = document.querySelectorAll('.answer');
const quizAnswersText = document.querySelectorAll('.answer span');
const hudTimer = document.querySelector('.timer');
const hudScoreSpan = document.querySelector('.score span');
const hudMultiplierSpan = document.querySelector('.multiplier span');
const hudQuestionCounter = document.querySelectorAll('.question-counter span')[0];
const hudQuestionCounterTotal = document.querySelectorAll('.question-counter span')[1];

//Constants
const CORRECT_BONUS = 10;

let timerMax = 30;
let timerId, timeLeft;
let shuffledQuestions, shuffledAnswers, currentQuestion;
let answerSpree = [];
let isOnSpree;
let acceptingAnswers;

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
    correct: 0,
    answered: 0
}

const quiz = {
    questionsTotal: availQuestions.length,
    questionsCounter: 0
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

function clearStatusClass(array) {
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
    if (quiz.questionsCounter != quiz.questionsTotal) {
        shuffledQuestions = shuffle(availQuestions);
        currentQuestion = shuffledQuestions.shift();
        quizQuestion.innerText = currentQuestion.question;
        shuffledAnswers = shuffle(currentQuestion.answers);
        clearStatusClass(quizAnswersBtn);
        for (let i = 0; i < quizAnswersText.length; i++) {
            quizAnswersText[i].innerText = shuffledAnswers[i].answer;
            if (shuffledAnswers[i].hasOwnProperty('correct')) {
                quizAnswersText[i].parentElement.dataset.correct = true;
            }
            quizAnswersBtn[i].classList.add('set');
            quizAnswersBtn[i].addEventListener('click', selectAnswer);
        }
        quiz.questionsCounter += 1;
        acceptingAnswers = true;
        startTimer(timerMax);
    } else {
        quizEnd();
    }
    hudQuestionCounterTotal.innerText = quiz.questionsTotal;
    hudQuestionCounter.innerText = quiz.questionsCounter;
}

function startTimer(seconds) {
    hudTimer.innerText = timerMax;

    timeLeft = seconds;
    timerId = setInterval(tickTock, 1000);

    function tickTock() {
        if (timeLeft === -1) {
            showQuestion();
        } else {
            hudTimer.innerHTML = timeLeft;
            timeLeft--;
        }
    }
}

function stopTimer(timer) {
    clearInterval(timer);
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
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedAnswer = e.target;
    stopTimer(timerId);
    selectSiblings(quizAnswersBtn, selectedAnswer).forEach(btn => {
        btn.classList.add('disabled');
    })
    if (selectedAnswer.dataset.correct) {
        selectedAnswer.classList.add('correct');
        player.correct++;
    } else {
        selectedAnswer.classList.add('incorrect');
    }
    player.answered++;
    updateScore(selectedAnswer);
    setTimeout(() => {
        quizAnswersBtn.forEach(btn => {
            btn.classList.add('unset');
        })
        setTimeout(showQuestion, 1000);
    }, 1000);
}

function updateScore(selected) {
    if (selected.dataset.correct) {
        player.score = player.score + ((CORRECT_BONUS * player.multiplier) + calcTimer());
        answerSpree.push(true);
        isOnSpree = answerSpree.reduce((i, a) => i + a, 0);
        if (isOnSpree > 0 && isOnSpree % 2 == 0) {
            shortenTimer();
            player.multiplier++;
        }
    } else if (!!selected.dataset.correct == false) {
        resetTimer();
        player.multiplier = 1;
        answerSpree = [];
    }
    hudMultiplierSpan.innerText = player.multiplier;
    hudScoreSpan.innerText = player.score;
}

function calcTimer() {
    if (timerMax === 30) {
        return timeLeft;
    } else if (timerMax === 20) {
        return timeLeft * 3;
    } else if (timerMax <= 10) {
        return timeLeft * 8;
    }
}

function shortenTimer() {
    if (timerMax > 10) {
        timerMax -= 10;
    } else if (timerMax <= 10 && timerMax > 5) {
        timerMax -= 5;
    }
}

function resetTimer() {
    timerMax = 30;
}

function quizEnd() {
    quizModal.innerHTML = `
    <h2>Well done!</h2>
    <p>Lets see how you did...</p>
    <table>
        <tr>
            <th>Name</th>
            <td>${player.name}</td>
        </tr>
        <tr>
            <th>Correct Questions</th>
            <td>${player.correct}</td>
        </tr>
        <tr>
            <th>Questions Answered</th>
            <td>${player.answered} out of ${quiz.questionsTotal}</td>
        </tr>
        <tr>
            <th>Score</th>
            <td>${player.score}</td>
        </tr>
    </table>
    <button type="submit" class="quiz-submit" onclick="window.location.reload();">Replay Icon</button>
    `
    quizModalContainer.classList.remove('active');
}