const { expect } = require('expect');
const {
    beforeEach,
    afterEach,
} = require('jest-circus');

/**
 * @jest-environment jsdom
 */
require('jest-fetch-mock').enableMocks();

let callAPI, player, quiz, quizStart, countdown, shuffle, clearStatusClass, showQuestion, startTimer, stopTimer, shortenTimer, selectSiblings, selectAnswer, updateScore, calcTimer, resetTimer, quizEnd;

const mockResponseData = {
    "response_code": 200,
    "results": [{
            "question": "Question 1?",
            "correct_answer": "Correct Answer 1",
            "incorrect_answers": ["Answer1.1", "Answer1.2", "Answer1.3"]
        },
        {
            "question": "Question 2?",
            "correct_answer": "Correct Answer 2",
            "incorrect_answers": ["Answer2.1", "Answer2.2", "Answer2.3"]
        },
        {
            "question": "Question 3?",
            "correct_answer": "Correct Answer 3",
            "incorrect_answers": ["Answer3.1", "Answer3.2", "Answer3.3"]
        }
    ]
}

const trigger = (el, etype) => {
    const evt = new Event(etype, {
        bubbles: true
    });
    el.dispatchEvent(evt);
    return evt;
};

global.fetch = jest.fn((url, options) => {
    return new Promise((resolve, reject) => {
        const testResponse = {
            status: 200,
            ok: true,
            json() {
                return new Promise((resolve, reject) => {
                    resolve(mockResponseData);
                })
            }
        }
        resolve(testResponse);
    })
});

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("quiz.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

    callAPI = require("../quiz.js").callAPI;
    player = require("../quiz.js").player;
    quiz = require("../quiz.js").quiz;
    quizStart = require("../quiz.js").quizStart;
    countdown = require("../quiz.js").countdown;
    shuffle = require("../quiz.js").shuffle;
    clearStatusClass = require("../quiz.js").clearStatusClass;
    showQuestion = require("../quiz.js").showQuestion;
    startTimer = require("../quiz.js").startTimer;
    tickTock = require("../quiz.js").tickTock;
    stopTimer = require("../quiz.js").stopTimer;
    shortenTimer = require("../quiz.js").shortenTimer;
    selectSiblings = require("../quiz.js").selectSiblings;
    selectAnswer = require("../quiz.js").selectAnswer;
    updateScore = require("../quiz.js").updateScore;
    calcTimer = require("../quiz.js").calcTimer;
    resetTimer = require("../quiz.js").resetTimer;
    quizEnd = require("../quiz.js").quizEnd;
})

afterEach(() => {
    global.mockClear();
})

describe("Objects exist and have correct value", () => {
    test("Player object exists and has correct key value pairs", () => {
        expect(player.name).toBe(0);
        expect(player.score).toBe(0);
        expect(player.multiplier).toBe(1);
        expect(player.correct).toBe(0);
        expect(player.answered).toBe(0);
    });
    test("Quiz object exists and has correct key value pairs", () => {
        expect(quiz.questionsTotal).toBe(0);
        expect(quiz.questionsCounter).toBe(0);
    });
})

describe("Quiz Name input validation", () => {
    test("Input does not allow for less than 3 characters", () => {
        document.querySelector('#quiz-name').value = 'AB';
        trigger(document.querySelector('#quiz-name'), 'input');
        expect(document.querySelector('.quiz-submit').hasAttribute("disabled")).toBe(true);
    });
    test("Input does not allow for empty string (spaces)", () => {
        document.querySelector('#quiz-name').value = '   ';
        trigger(document.querySelector('#quiz-name'), 'input');
        expect(document.querySelector('.quiz-submit').hasAttribute("disabled")).toBe(true);
    });
    test("Providing min 3 characters and clicking 'Lets go!' calls quizStart function", () => {
        document.querySelector('#quiz-name').value = 'ABC';
        trigger(document.querySelector('#quiz-name'), 'input');
        trigger(document.querySelector('.quiz-submit'), 'click');
        expect(player.name).toBe('ABC');
        expect(document.querySelector('.quiz-submit').hasAttribute("disabled")).toBe(false);
        expect(document.querySelector('.quiz-start-container').classList.contains('active')).toBe(true);
        expect(document.querySelector('#countdown').innerHTML).toBe('');
    });
})

describe("Test shuffle() function", () => {
    test("shuffle function works correctly", () => {
        let newArray1 = [5, 4, 3, 2, 1];
        let newArray2 = shuffle(newArray1);
        expect(newArray2).not.toBe([5, 4, 3, 2, 1]);
        expect(newArray2).not.toBe([1, 2, 3, 4, 5]);
    });
})

describe("Test clearStatusClass() function", () => {
    test("clearStatusClass correctly removes all addl classes", () => {
        document.querySelectorAll('.answer')[0].classList.add('disabled');
        document.querySelectorAll('.answer')[1].classList.add('unset');
        document.querySelectorAll('.answer')[2].classList.add('set');
        document.querySelectorAll('.answer')[3].classList.add('correct');
        clearStatusClass(document.querySelectorAll('.answer'));
        expect(document.querySelectorAll('.answer')[0].classList.contains('disabled')).toBe(false);
        expect(document.querySelectorAll('.answer')[1].classList.contains('unset')).toBe(false);
        expect(document.querySelectorAll('.answer')[2].classList.contains('set')).toBe(false);
        expect(document.querySelectorAll('.answer')[3].classList.contains('correct')).toBe(false);
    });
})

describe("Test showQuestion() function", () => {
    test("showQuestion correctly loads question and answers", () => {
        showQuestion();
        expect(document.querySelector('.question').length).not.toBe(0);
        expect(document.querySelectorAll('.answer')[0].length).not.toBe(0);
        expect(document.querySelectorAll('.answer')[1].length).not.toBe(0);
        expect(document.querySelectorAll('.answer')[2].length).not.toBe(0);
        expect(document.querySelectorAll('.answer')[3].length).not.toBe(0);
    });
});

describe('callAPI', () => {
    const mockAPI = 'https://dummy-site.dev/restapi';
    test('Resolved promise should be defined', async () => {
        const results = await callAPI(mockAPI);
        expect(results).toBeDefined();
    })
    test('Should return any available response data', () => {
        expect(callAPI(mockAPI)).resolves.toEqual(mockResponseData);
    })
    test('Should call quizEnd and change quiz modal text  if status of response is not 200-299', async () => {
        fetch.mockImplementationOnce((url, options) => {
            return new Promise((resolve, reject) => {
                const testResponse = {
                    status: 500
                }
                resolve(testResponse);
            })
        });
        await callAPI(mockAPI);
        expect(document.querySelector('.quiz-start-container').classList.contains('active')).toBe(false);
        expect(document.querySelector('.quiz-start-box h2').innerHTML).toBe('Uh oh!');
    })
})

describe("Test startTimer() function", () => {
    test("Starts a timer and updates the quiz timer with time remaining", () => {
        jest.spyOn(global, 'setInterval');
        startTimer(30);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(document.querySelector('.timer').innerHTML).not.toBe(0);
    })
})

describe("Test stopTimer() function", () => {
    test("Function stops any interval or timeout that has been passed as parameter", () => {
        let tempTimeout = setTimeout(() => {
            return
        }, 1000);
        let tempInterval = setInterval(() => {
            return
        }, 1000);
        expect(stopTimer(tempTimeout)).toBe(null);
        expect(stopTimer(tempInterval)).toBe(null);
    })
})

describe("Test selectSiblings() function", () => {
    test("selectSiblings creates an array of siblings to skipThis parameter", () => {
        let tempArr = [1, 2, 3, 4];
        expect(selectSiblings(tempArr, 2)).toStrictEqual([1, 3, 4]);
    })
})

describe("Test selectAnswer() function", () => {
    test("selectAnswer runs as intended", () => {
        jest.spyOn(global, 'setTimeout');
        selectAnswer(trigger(document.querySelectorAll('.answer')[1], 'click'));
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(document.querySelectorAll('.answer')[2].classList).toContain('disabled');
        expect(player.answered).toBe(1);
    })
})

describe("Test calcTimer() function", () => {
    test("Timer at 20, multiply by 3", () => {
        let timerMax = 20;
        let timeLeft = 20;
        expect(calcTimer(timerMax, timeLeft)).toBe(60);
    })
    test("Timer at 10, multiply by 12", () => {
        let timerMax = 10;
        let timeLeft = 10;
        expect(calcTimer(timerMax, timeLeft)).toBe(120);
    })
    test("Timer at 5, multiply by 48", () => {
        let timerMax = 5;
        let timeLeft = 5;
        expect(calcTimer(timerMax, timeLeft)).toBe(240);
    })
})

describe("Test resetTimer() function", () => {
    test("Each time function is called resets variable to 30", () => {
        expect(resetTimer()).toBe(30);
        expect(typeof resetTimer()).toBe('number');
    })
})

describe("Test updateScore() function when answer is correct", () => {
    beforeAll(() => {
        let tempArr = document.querySelectorAll('.answer');
        let correctTemp;
        player.score = 0;
        showQuestion();
        tempArr.forEach(el => {
            if (el.innerHTML.startsWith('<span>Correct Answer')) {
                correctTemp = el;
            }
        })
        updateScore(correctTemp);
        updateScore(correctTemp);
    })
    test("Player score updates correctly", () => {
        expect(player.score).toBe(80);
    })
    test("Player Multiplier + 1 when two correct consecutive answers", () => {
        expect(player.multiplier).toBe(2);
    })
    test("Timer shortened per spree", () => {
        expect(shortenTimer()).toBe(10);
    })
    test("DOM Elements are updated appropriately", () => {
        expect(document.querySelector('.score span').innerText).toEqual(player.score);
        expect(document.querySelector('.multiplier span').innerText).toEqual(player.multiplier);
    })
});

describe("Test updateScore() function when answer is incorrect", () => {
    beforeAll(() => {
        let tempArr = document.querySelectorAll('.answer');
        let incorrectTemp;
        player.score = 0;
        showQuestion();
        tempArr.forEach(el => {
            if (el.innerHTML.startsWith('<span>Answer')) {
                incorrectTemp = el;
                return;
            }
        })
        updateScore(incorrectTemp);
        updateScore(incorrectTemp);
    })
    test("Player score updates correctly", () => {
        expect(player.score).toBe(0);
    })
    test("Player Multiplier remains at 1", () => {
        expect(player.multiplier).toBe(1);
    })
    test("Timer is reset to 30", () => {
        expect(resetTimer()).toBe(30);
    })
    test("DOM Elements are updated appropriately", () => {
        expect(document.querySelector('.score span').innerText).toEqual(player.score);
        expect(document.querySelector('.multiplier span').innerText).toEqual(player.multiplier);
    })
});