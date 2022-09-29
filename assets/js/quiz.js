//Constants
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
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

let timerMax = 30;
let timerId, timeLeft;
let shuffledQuestions, shuffledAnswers, currentQuestion, acceptingAnswers, isOnSpree;
let answerSpree = [];
let availQuestions = [];

// Collects name and quiz progress.
const player = {
    name: 0,
    score: 0,
    multiplier: 1,
    correct: 0,
    answered: 0
};

// Holds information used to fill question-counter HUD.
const quiz = {
    questionsTotal: 0,
    questionsCounter: 0
};

/**
 * 
 * @param {url} api_url link to API.
 * @returns a promise.
 */
async function callAPI(api_url) {
    let data = {};
    const response = await fetch(api_url);
    // assign response to variable when promise resolves
    if (response.status > 199 && response.status < 300) {
        data = await response.json();
        return data;
    } else {
        questionsAPIError();
    }
}

function questionsAPIError() {
    quizEnd();
    quizModal.innerHTML = `
        <h2>Uh oh!</h2>
        <p> Something went wrong. Please refresh the page!</p>`;
}

// Imports hard-coded questions from JSON file.
callAPI("https://nyxhexen.github.io/CI_MS2_MM/assets/js/questions.json")
    .then(loadedQuestions => {
        availQuestions = Array.from(loadedQuestions);
    });

// Imports questions through TriviaDB API.
callAPI("https://opentdb.com/api.php?amount=14&category=19&difficulty=medium&type=multiple")
    .then(loadedQuestions => {
        let tempArr = [];
        loadedQuestions.results.forEach(entry => {
            const question = {
                question: entry.question,
                answers: [{
                    correct: true,
                    answer: entry.correct_answer
                }]
            };
            entry.incorrect_answers.forEach(item => {
                const answer = {
                    answer: item
                };
                question.answers.push(answer);
            });
            tempArr.push(question);
        });
        availQuestions = availQuestions.concat(tempArr);
    });

// Each time a number/letter is added check if the input field value is longer than 3 characters.
// If it is, enable the quiz start button.
quizInput.addEventListener('input', () => {
    if (quizInput.value.includes(" ")) {
        quizSubmit.disabled = true;
    } else if (quizInput.value.length > 2) {
        quizSubmit.disabled = false;
    } else {
        quizSubmit.disabled = true;
    }
});

// On button click start the quiz app.
quizSubmit.addEventListener('click', () => {
    player.name = quizInput.value;
    quiz.questionsTotal = availQuestions.length;
    quizModalContainer.classList.add('active');
    setTimeout(quizStart, 1000);
});

/**
 * Calls countdown function and after 1500 seconds scales down 
 * the countdownDiv element and calls showQuestion function.
 */
function quizStart() {
    countdown(countdownDiv, function () {
        countdownDiv.innerHTML = '<p class="num">START!</p>';
        setTimeout(() => {
            countdownDiv.style.transform = "scaleY(0)";
            showQuestion();
        }, 1500);
    });
}

//https://stackoverflow.com/questions/50190639/trying-to-create-a-numeric-3-2-1-countdown-with-javascript-and-css
/**
 * countdown initiates a 3-2-1 countdown timer and once it reaches 0 calls the callback function.
 * @param {HTMLElement} parent - div inside of which the 3-2-1 countdown will be inserted.
 * @param {callback} callback - function to call after counter reaches 0.
 */
function countdown(parent, callback) {
    let numbers = [3, 2, 1];
    let numDiv = null;
    var interval = setInterval(count, 1000);

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
}

/**
 * shuffle takes an array and shuffles it using array.sort and Math.random methods.
 * @param {array} array
 * @returns shuffled array
 */
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

/**
 * clearStatusClass goes through each item in the HTML elements and removes all classes added by other functions.
 * @param {array} array - array of HTML elements.
 */
function clearStatusClass(array) {
    array.forEach(item => {
        item.classList.remove('unset');
        item.classList.remove('set');
        item.classList.remove('disabled');
        item.classList.remove('correct');
        item.classList.remove('incorrect');
        delete item.dataset.correct;
    });
}

/**
 * showQuestion shuffles the questions array, removes the last question 
 * in the array and displays it on the page, calls clearStatusClass on the 
 * answer buttons, loops through the answers array assigning 'set' class and dataset, 
 * adds an event listener to each answer, sets acceptingAnswers to true to allow click,
 * progresses the questions counter and starts the timer. After the last question calls quizEnd function.
 */
function showQuestion() {
    if (quiz.questionsCounter != quiz.questionsTotal) {
        if (availQuestions.length > MAX_QUESTIONS){
            availQuestions = availQuestions.slice(0, 21);
            quiz.questionsTotal = availQuestions.length - 1;
        }
        shuffledQuestions = shuffle(availQuestions);
        currentQuestion = shuffledQuestions.shift();
        quizQuestion.innerHTML = currentQuestion.question;
        shuffledAnswers = shuffle(currentQuestion.answers);
        clearStatusClass(quizAnswersBtn);
        for (let i = 0; i < quizAnswersText.length; i++) {
            quizAnswersText[i].innerHTML = shuffledAnswers[i].answer;
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

/**
 * startTimer starts a timer for n seconds, depending on param passed
 * by calling tickTock function every 1000ms.
 * @param {seconds} seconds - how many seconds should the timer be?
 */
function startTimer(seconds) {
    hudTimer.innerText = timerMax;

    timeLeft = seconds;
    timerId = setInterval(tickTock, 1000);

    /**
     * tickTock function subtracts 1 from the amount of seconds 
     * remaining in seconds parameter passed to startTimer function.
     * If remaining seconds is 0 - stops timerId interval, resets the default timer to 30sec,
     * resets the multiplier to 1 and answerSpree array to empty, and calls showQuestion.
     */
    function tickTock() {
        if (timeLeft === -1) {
            stopTimer(timerId);
            resetTimer();
            player.multiplier = 1;
            answerSpree = [];
            showQuestion();
        } else {
            hudTimer.innerHTML = timeLeft;
            timeLeft--;
        }
    }
}

/**
 * stopTimer resets the interval or timeout depending on name passed as parameter.
 * @param {interval} timer - name of active setInterval/setTimeout.
 */
function stopTimer(timer) {
    clearInterval(timer);
    timer = null;
    return timer;
}

/**
 * Selects all siblings of the skipThis element except the skipThis 
 * element and returns a new array containing only skipThis' siblings.
 * @param {array} array - array of HTML sibling elements.
 * @param {HTMLElement} skipThis - HTML element to not select/skip.
 * @returns new array containing only the second parameter's siblings.
 */
function selectSiblings(array, skipThis) {
    let arr = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != skipThis) {
            arr.push(array[i]);
        }
    }
    return arr;
}

/**
 * selectAnswer stops the quiz timer, sets acceptingAnswers to false,
 * disables all buttons, adds class if answer is correct/incorrect 
 * and increases correct answers value by 1, increases answered questions value by 1,
 * calls updateScore using event target as param, after 1000ms adds 'unset' class to buttons, 
 * then 1000ms later calls showQuestion function.
 * @param {event} e - uses click event to target element.
 * @returns if acceptingAnswers is false.
 */
function selectAnswer(e) {
    if (!acceptingAnswers) return false;
    stopTimer(timerId);
    acceptingAnswers = false;
    const selectedAnswer = e.target;
    selectSiblings(quizAnswersBtn, selectedAnswer).forEach(btn => {
        btn.classList.add('disabled');
    });
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
        });
        setTimeout(showQuestion, 1000);
    }, 1000);
}

/**
 * If the passed parameter has data-correct value of true, 
 * increases player score depending on multiplier and time remaining on timer.
 * If the user has an even amount number of consecutive answers 
 * increases multiplier and calls shortenTimer function.
 * If data-correct is incorrect, calls resetTimer function, resets 
 * multiplier to 1 and resets the answerSpree variable.
 * @param {HTMLElement} selected - click event target.
 */
function updateScore(selected) {
    if (selected.dataset.correct) {
        player.score = player.score + ((CORRECT_BONUS * player.multiplier) + calcTimer());
        answerSpree.push(true);
        isOnSpree = answerSpree.reduce((i, a) => i + a, 0);
        if (isOnSpree > 0 && isOnSpree % 2 == 0) {
            shortenTimer();
            player.multiplier++;
        }
    } else if (!selected.dataset.correct == true) {
        resetTimer();
        player.multiplier = 1;
        answerSpree = [];
    }
    hudMultiplierSpan.innerText = player.multiplier;
    hudScoreSpan.innerText = player.score;
}

/**
 * Returns a calculation total depending on the time remaining 
 * on the timer at the time this function is called.
 * Used inside of updateScore to increase score after answer is selected.
 * @returns calculation total.
 */
function calcTimer() {
    if (timerMax === 30) {
        return timeLeft;
    } else if (timerMax === 20) {
        return timeLeft * 3;
    } else if (timerMax === 10) {
        return timeLeft * 5;
    } else if (timerMax === 5) {
        return (timeLeft * 100)
    }
}

/**
 * Shortens timer depending on total timer time at the time the function is called.
 * If > 10 reduces total timer time by 10 seconds, if between 10 and 
 * 5 reduces total timer time by 5 seconds.
 */
function shortenTimer() {
    if (timerMax > 10) {
        timerMax -= 10;
    } else if (timerMax <= 10 && timerMax > 5) {
        timerMax -= 5;
    }
}

/**
 * Reset total timer time to default value of 30 seconds.
 */
function resetTimer() {
    timerMax = 30;
}

/**
 * Replaces start modal content with collected quiz stats and shows modal after the last question.
 */
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
            <th>Correct Answers</th>
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
    <button type="submit" class="quiz-submit" onclick="window.location.reload();">Replay <i class="fa-solid fa-rotate-left"></i></button>
    `;
    quizModalContainer.classList.remove('active');
}

module.exports = {
    quizStart,
    countdown,
    shuffle,
    clearStatusClass,
    startTimer,
    stopTimer,
    selectSiblings,
    selectAnswer,
    updateScore,
    calcTimer,
    resetTimer,
    quizEnd,
    player,
    quiz,
    callAPI,
    showQuestion,
}