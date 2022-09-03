// Hamburger Button
document.querySelector('.hamburger-menu-button').addEventListener('click', function () {
    document.querySelector('.nav-links-container').classList.toggle('active');
});

// Methodology - index.html
const methods = document.querySelectorAll('.method');

methods.forEach(method => {
    method.addEventListener('click', () => {
        method.classList.toggle('active');
    })
})

//Modal #Legal
const modalContainer = document.querySelector('#modal-container');
const modalHeading = document.querySelector('.modal').childNodes[1];
const modalText = document.querySelector('.modal').childNodes[3];
const legalButtons = document.querySelectorAll('.legal-button');
const legalSwitch = [{
    "h2": "This is TNC option!",
    "text": "<p>Sed nisi lacus sed viverra tellus in. Dui nunc mattis enim ut tellus elementum sagittis. Non diam phasellus vestibulum lorem sed risus ultricies tristique. In massa tempor nec feugiat. Parturient montes nascetur ridiculus mus mauris. Justo nec ultrices dui sapien. Massa sapien faucibus et molestie ac feugiat sed lectus. Sed risus ultricies tristique nulla aliquet. Ligula ullamcorper malesuada proin libero nunc. Sapien et ligula ullamcorper malesuada proin libero nunc consequat. Id diam maecenas ultricies mi eget. Ut tristique et egestas quis ipsum suspendisse. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque.Sed nisi lacus sed viverra tellus in. Dui nunc mattis enim ut tellus elementum sagittis. Non diam phasellus vestibulum lorem sed risus ultricies tristique. In massa tempor nec feugiat. Parturient montes nascetur ridiculus mus mauris. Justo nec ultrices dui sapien. Massa sapien faucibus et molestie ac feugiat sed lectus. Sed risus ultricies tristique nulla aliquet. Ligula ullamcorper malesuada proin libero nunc. Sapien et ligula ullamcorper malesuada proin libero nunc consequat. Id diam maecenas ultricies mi eget. Ut tristique et egestas quis ipsum suspendisse. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. </p>"
}, {
    "h2": "This is Privacy Policy option!",
    "text": "<p>YES!</p>"
}]

legalButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.id === "tnc") {
            modalHeading.innerHTML = legalSwitch[0].h2;
            modalText.innerHTML = legalSwitch[0].text;
            modalContainer.removeAttribute('class');
            modalContainer.classList.toggle('active');
        } else {
            modalHeading.innerHTML = legalSwitch[1].h2;
            modalText.innerHTML = legalSwitch[1].text;
            modalContainer.removeAttribute('class');
            modalContainer.classList.toggle('active');
        }
    })
})

modalContainer.addEventListener('click', () => {
    modalContainer.classList.toggle('out');
});

// Carousel - index.html
if (window.location.pathname == '/index.html') {
    const carousel = document.getElementById('carousel');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselTabs = document.querySelectorAll('.tab');

    var carouselIndex = 0;

    const toggleActive = () => {
        carouselTabs[carouselIndex].classList.toggle('active');
        carouselSlides[carouselIndex].removeAttribute('style');
    }

    let activeTimeout = setInterval(toggleActive, 2000);

    for (let i = 0; i < carouselTabs.length; i++) {
        carouselTabs[i].addEventListener("click", () => {
            for (let j = 0; j < carouselTabs.length; j++) {
                carouselTabs[j].classList.remove('active');
                carouselSlides[j].removeAttribute('style');
            }
            carouselIndex = i;
            carouselTabs[carouselIndex].classList.toggle('active');
            carouselSlides[carouselIndex].style.setProperty("z-index", "4");
        })
    }

    const slideNext = () => {
        if (carouselIndex === carouselSlides.length - 1) {
            carouselIndex = 0;
        } else {
            carouselIndex++;
        }
        carouselTabs[carouselIndex].classList.toggle('active');
        carouselSlides[carouselIndex].style.setProperty("z-index", "4");
    }

    // On hover stop the timers
    let carouselTimer = setInterval(slideNext, 2000);
    carousel.addEventListener('mouseenter', (e) => {
        clearInterval(activeTimeout);
        clearInterval(carouselTimer);
    });
    carousel.addEventListener('mouseleave', (e) => {
        activeTimeout = setInterval(toggleActive, 2000);
        carouselTimer = setInterval(slideNext, 2000);
    });

}

// ------ QUIZ PAGE ------
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