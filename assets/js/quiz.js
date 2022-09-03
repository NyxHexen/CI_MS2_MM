const quizModalContainer = document.querySelector('.quiz-start-container');
const quizModal = document.querySelector('.quiz-start-box');
const quizInput = document.querySelector('#quiz-name');
const quizSubmit = document.querySelector('.quiz-submit');
const quizContainer = document.querySelector('.quiz-container');
const countdownDiv = document.querySelector('#countdown');
const quizQuestion = document.querySelector('.question');
const quizAnswers = document.querySelectorAll('.answer span');
let currentQuestion = null;
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

function showQuestion() {
    currentQuestion = availQuestions.shift();
    quizQuestion.innerText = currentQuestion.question;
    setAnswers();
}

const setAnswers = () => {
    for (let i = 0; i < quizAnswers.length; i++) {
        quizAnswers[i].innerText = currentQuestion.answers[i].answer;
        quizAnswers[i].parentElement.classList.remove('unset');
        quizAnswers[i].parentElement.classList.add('set');
    }
}