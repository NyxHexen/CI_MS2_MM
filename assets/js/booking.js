const schoolLevelOption = document.querySelectorAll('.booking-radio');
const schoolYearDiv = document.querySelector('.school-year');
const schoolYearDropDown = document.querySelector('#school-year-select');
const schoolYearButtons = document.querySelector('#school-year-btns');
const schoolYearSelect = document.querySelector('.school-year select');
const activityCardsDiv = document.querySelector('#activity-cards');
const activityCardTemplate = document.querySelector("div[data-type='template']");
const activityNoClassCard = document.querySelector('.no-class-card');
const activitySubmitBtn = document.querySelectorAll('.activity-submit');
const bookingCartContainer = document.querySelector('#booking-cart-container');
const bookingCart = document.querySelector('.booking-cart');
const bookingCartTotal = document.querySelector('.booking-cart-total');
const bookingCartSubmit = document.querySelector('.booking-cart-submit');
const bookingCartRemove = document.querySelectorAll('.booking-cart i');
const mailingInfoNameInput = document.querySelector('#order-name');
const mailingInfoEmailInput = document.querySelector('#order-email');

let subTotal = 0;
let bookedClasses = [];
let order = {
    name: "",
    email: "",
    classes: "",
    total: subTotal
};

window.onbeforeunload = function () {
    sessionStorage.clear();
}

const primaryOptions = [{
    name: "Year 1",
    classes: [{
        activity: "Calculation Skills",
        level: "Beginner",
        schedule: "Every Tuesday, 5:30pm - 6.10pm",
        price: "£" + 40,
        tutor: {
            image: "assets/images/thefamouspeople-profiles-archimedes-422.webp",
            name: "Archimedes of Syracuse",
            title: "Academy Director"
        }
    }],
}, {
    name: "Year 2",
    classes: [{
        activity: "Multiplication Skills",
        level: "Intermediate",
        schedule: "Fortnightly, Mondays 6pm - 7pm",
        price: "£" + 50,
        tutor: {
            image: "assets/images/theempireoffilms-wordpress-2012-08-15-pythagoras.webp",
            name: "Pythagoras of Samos",
            title: "Tutor"
        }
    }]
}, {
    name: "Year 3",
    classes: []
}, {
    name: "Year 4",
    classes: []
}, {
    name: "Year 5",
    classes: [{
        activity: "Entry Mock Exam",
        level: "Everybody welcome!",
        schedule: "15/09/2022, 6pm - 7pm",
        price: "Free",
        tutor: {
            image: "assets/images/wikipedia-Alan-Turing.jpg",
            name: "Alan Turing",
            title: "Tutor"
        }
    }, {
        activity: "Entry Mock Exam II",
        level: "Everybody welcome!",
        schedule: "15/09/2022, 7:30pm - 8:30pm",
        price: "Free",
        tutor: {
            image: "assets/images/wikipedia-Alan-Turing.jpg",
            name: "Alan Turing",
            title: "Tutor"
        }
    }]
}, {
    name: "Year 6",
    classes: [{
        activity: "Year 7 Preparation - End of Year",
        level: "Intermediate",
        schedule: "17/04/2022, 12pm - 2pm",
        price: "£149.99",
        tutor: {
            image: "assets/images/wikipedia-Isaac-Newton.jpg",
            name: "Isaac Newton",
            title: "Tutor"
        }
    }]
}];
const secondaryOptions = [{
    name: "Year 7",
    classes: [{
        activity: "Year 7 Overview and Plan",
        level: "Beginner",
        schedule: "1/9/2022, 5:30pm - 6.15pm",
        price: "£" + 40,
        tutor: {
            image: "assets/images/thefamouspeople-profiles-archimedes-422.webp",
            name: "Archimedes of Syracuse",
            title: "Academy Director"
        }
    }]
}, {
    name: "GCSE",
    classes: [{
        activity: "GCSE Prep Course",
        level: "Advanced",
        schedule: "8 weeks, every Tuesday, 5pm - 8pm",
        price: "£" + 350,
        tutor: {
            image: "assets/images/thefamouspeople-profiles-archimedes-422.webp",
            name: "Archimedes of Syracuse",
            title: "Academy Director"
        }
    }]
}];

schoolLevelOption.forEach(radio => {
    radio.addEventListener('click', displaySchoolYearOptions);
});

function displaySchoolYearOptions(e) {
    const selectedOption = e.target;
    schoolYearDropDown.innerHTML = "";
    schoolYearButtons.innerHTML = "";
    if (selectedOption.id === "sch_lvl1") {
        createSchoolYearOptions(primaryOptions);
    } else {
        createSchoolYearOptions(secondaryOptions);
    }
}

function createSchoolYearOptions(arr) {
    if (window.getComputedStyle(schoolYearDropDown).display !== 'none') {
        schoolYearDropDown.innerHTML = `<option value="default">-- Pick Year --</option>`
        arr.forEach(item => {
            schoolYearDropDown.innerHTML += `<option value="year-${item.name.charAt(item.name.length -1)}">${item.name}</option>`;
        })
    } else {
        arr.forEach(item => {
            schoolYearButtons.innerHTML += `
                <div class="sch-yr-rd">
                    <label for="sch_yr${item.name.charAt(item.name.length -1)}">${item.name}</label>
                    <input type="radio" name="sch-yr" id="sch_yr${item.name.charAt(item.name.length -1)}">
                </div>`;
        })
    }
}

schoolYearSelect.addEventListener('change', () => {
    // https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
    let selectedLevel = schoolLevelOption[0].checked ?
        Object.keys({
            primaryOptions
        })[0] :
        schoolLevelOption[1].checked ?
        Object.keys({
            secondaryOptions
        })[0] :
        false;
    if (selectedLevel === 'primaryOptions') {
        displayClasses(primaryOptions);
    } else if (selectedLevel === 'secondaryOptions') {
        displayClasses(secondaryOptions);
    }
}, false);

function displayClasses(arr) {
    deleteOldCards();
    let docFrag = document.createDocumentFragment();
    //Inspired by https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
    arr.forEach(year => {
        if (year.name == schoolYearSelect.options[schoolYearSelect.selectedIndex].text && year.classes.length != 0) {
            for (let i = 0; i < year.classes.length; i++) {
                let tempTemplateNode = activityCardTemplate.cloneNode(true);
                if (!sessionStorage.getItem(year.classes[i].activity)) {
                    sessionStorage.setItem(year.classes[i].activity, 'enabled');
                };
                tempTemplateNode.querySelector('h4').textContent = year.classes[i].activity;
                tempTemplateNode.querySelector('.level span').textContent = year.classes[i].level;
                tempTemplateNode.querySelector('.schedule span').textContent = year.classes[i].schedule;
                tempTemplateNode.querySelector('.price span').textContent = year.classes[i].price;
                tempTemplateNode.querySelector('.tutor img').src = year.classes[i].tutor.image;
                tempTemplateNode.querySelector('.tutor-info h5').textContent = year.classes[i].tutor.name;
                tempTemplateNode.querySelector('.tutor-info p').textContent = year.classes[i].tutor.title;
                tempTemplateNode.querySelector('.activity-submit').addEventListener('click', () => {
                    if (sessionStorage.getItem(year.classes[i].activity) == 'enabled' && !!sessionStorage.getItem('btnsDisabled') !== true) {
                        addToCart(year.classes[i].activity, year.classes[i].price);
                    }
                });
                tempTemplateNode.style.display = 'flex';
                delete tempTemplateNode.dataset.type;
                docFrag.appendChild(tempTemplateNode);
            }
        } else if (year.name == schoolYearSelect.options[schoolYearSelect.selectedIndex].text && year.classes.length == 0) {
            activityNoClassCard.style.display = "flex";
        }
    })
    activityCardsDiv.appendChild(docFrag);
    delete docFrag;
    updateAddBtn();
}

function deleteOldCards() {
    let activityCards = document.querySelectorAll('.activity-card');
    activityNoClassCard.style.display = "none";
    activityCards.forEach(card => {
        if (!card.hasAttribute('data-type')) {
            card.remove();
        }
    })
}

function addToCart(className, classPrice) {
    let selectedClass = `<div class="selected-class"><i class="fa-solid fa-xmark"></i>${className} <span>${classPrice}</span></div>`
    sessionStorage.setItem(className, 'disabled');
    if (window.getComputedStyle(bookingCartContainer).display == 'none') {
        bookingCartContainer.style.display = 'flex';
    }
    bookingCart.innerHTML += selectedClass;
    bookingCart.querySelectorAll('.selected-class i').forEach(item => {
        item.addEventListener('click', (e) => {
            removeFromCart(e);
        })
    });
    updateCartTotal();
    updateAddBtn()
}

function updateCartTotal() {
    subTotal = 0;
    bookingCartTotal.querySelector('span').innerHTML = "";
    bookingCart.querySelectorAll('.selected-class span').forEach(item => {
        let itemPrice = item.innerHTML.slice(1, item.innerHTML.length);
        if (!isNaN(itemPrice)) {
            subTotal += parseInt(itemPrice);
        }
    })
    bookingCartTotal.querySelector('span').innerHTML = "£" + subTotal;
}

function removeFromCart(e) {
    let classToRemove = e.target.parentNode;
    let className = classToRemove.innerHTML.slice(classToRemove.innerHTML.indexOf('</i>') + 4, classToRemove.innerHTML.indexOf('<span>') - 1);
    let classPrice = classToRemove.querySelector('span').innerHTML.slice(1, 4);
    if (!isNaN(classPrice)) {
        subTotal -= classPrice;
    }
    sessionStorage.setItem(className, 'enabled');
    classToRemove.remove();
    updateCartTotal();
    updateAddBtn()
}

function updateAddBtn() {
    if (sessionStorage.getItem('btnsDisabled') == true) {
        document.querySelectorAll('.activity-submit').forEach(btn => {
            btn.disabled = true
        });
    } else {
        document.querySelectorAll('.activity-submit').forEach(btn => {
            for (let i = 0; i < sessionStorage.length; i++) {
                if (sessionStorage.key(i) == btn.parentNode.firstElementChild.innerText) {
                    if (sessionStorage.getItem(sessionStorage.key(i)) === 'disabled') {
                        btn.disabled = true;
                        btn.innerHTML = 'Added';
                    } else {
                        btn.disabled = false;
                        btn.innerHTML = 'Add to Cart'
                    };
                }
            }
        });
    }
}

bookingCartSubmit.addEventListener('click', () => {
    bookingCartContainer.classList.add('submitted');
    sessionStorage.setItem('btnsDisabled', 'true');
    bookingCart.querySelectorAll('.selected-class').forEach(item => {
        bookedClasses.push(item.innerHTML.slice(item.innerHTML.indexOf('</i>') + 4, item.innerHTML.indexOf('<span>') - 1));
    })
    order.classes = bookedClasses.join(' & ');
    order.total = subTotal;
    showMailingForm();
    updateAddBtn();
})

function showMailingForm() {
    bookingCartContainer.classList.add('mailing-info');
    setTimeout(() => {
        bookingCartContainer.classList.remove('submitted')
    }, 1000);
}

bookingCartContainer.querySelector('.send').addEventListener('click', (e) => {
    if (!mailingInfoEmailInput.validity.valid || !mailingInfoNameInput.validity.valid){
        mailingInfoEmailInput.reportValidity();
        mailingInfoNameInput.reportValidity();
    } else if (!isEmailValid(mailingInfoEmailInput.value)){
        reportInvalidEmail(mailingInfoEmailInput);
    } else {
        
        console.log('empty both input fields and send e-mail')
    }
})

bookingCartContainer.querySelector('.back').addEventListener('click', () => {
    bookingCartContainer.classList.remove('mailing-info');
})

function isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

function reportInvalidEmail(insertAfterNode){
    const error = document.createElement('p');
    error.classList.add('error');
    error.innerText = 'Your e-mail address is missing its TLD (.com, .co.uk, etc.)';
    insertAfterNode.parentElement.insertBefore(error, insertAfterNode.nextSibling);
}