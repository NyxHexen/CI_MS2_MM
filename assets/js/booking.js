// Constants
const schoolLevelOption = document.querySelectorAll('.booking-radio');
const schoolYearDropDown = document.querySelector('#school-year-select');
const schoolYearSelect = document.querySelector('.school-year select');
const activityCardsDiv = document.querySelector('#activity-cards');
const activityCardTemplate = document.querySelector("div[data-type='template']");
const activityNoClassCard = document.querySelector('.no-class-card');
const bookingCartContainer = document.querySelector('#booking-cart-container');
const bookingCartDiv = document.querySelector('.booking-cart-div');
const bookingCart = document.querySelector('.booking-cart');
const bookingCartTotal = document.querySelector('.booking-cart-total');
const bookingCartSubmit = document.querySelector('.booking-cart-submit');
const mailingInfoDiv = document.querySelector('.mailing-info-div');
const mailingInfoNameInput = document.querySelector('#order-name');
const mailingInfoEmailInput = document.querySelector('#order-email');
const bookingCompleteDiv = document.querySelector('.booking-complete-div');
const newsletterNameInput = document.querySelector('#newsletter-name');
const newsletterEmailInput = document.querySelector('#newsletter-email');
const newsletterSelect = document.querySelector('#newsletter-findus');

let subTotal = 0; // Temporary total amount container
let bookedClasses = [];
let order = {
    name: "",
    email: "",
    classes: "",
    total: subTotal
};

// Clear sessionStorage before page loads.
window.onbeforeunload = function () {
    sessionStorage.clear();
};

// Holds classes information per school year from Primary option. 
const primaryOptions = [{
    name: "Year 1",
    classes: [{
        activity: "Calculation Skills",
        level: "Beginner",
        schedule: "Every Tuesday, 5:30pm - 6.10pm",
        price: "£" + 40,
        tutor: {
            image: "assets/images/tutor-img-archimedes.webp",
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
            image: "assets/images/tutor-img-pythagoras.webp",
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
            image: "assets/images/tutor-img-alan-turing.webp",
            name: "Alan Turing",
            title: "Tutor"
        }
    }, {
        activity: "Entry Mock Exam II",
        level: "Everybody welcome!",
        schedule: "15/09/2022, 7:30pm - 8:30pm",
        price: "Free",
        tutor: {
            image: "assets/images/tutor-img-alan-turing.webp",
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
            image: "assets/images/tutor-img-isaac-newton.webp",
            name: "Isaac Newton",
            title: "Tutor"
        }
    }]
}];

// Holds classes information per school year from Secondary option. 
const secondaryOptions = [{
    name: "Year 7",
    classes: [{
        activity: "Year 7 Overview and Plan",
        level: "Beginner",
        schedule: "1/9/2022, 5:30pm - 6.15pm",
        price: "£" + 40,
        tutor: {
            image: "assets/images/tutor-img-archimedes.webp",
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
            image: "assets/images/tutor-img-archimedes.webp",
            name: "Archimedes of Syracuse",
            title: "Academy Director"
        }
    }]
}];

// Trigger displaySchoolYearOptions with the event as a parameter on click.
schoolLevelOption.forEach(radio => {
    radio.addEventListener('click', displaySchoolYearOptions);
});

/**
 * Checks event target ID and populates select element with options accordingly.
 * @param {event} e - click event from school level buttons. 
 */
function displaySchoolYearOptions(e) {
    const selectedOption = e.target;
    schoolYearDropDown.innerHTML = "";
    if (selectedOption.id === "sch_lvl1") {
        createSchoolYearOptions(primaryOptions);
    } else {
        createSchoolYearOptions(secondaryOptions);
    }
}

/**
 * Populates select element using each object.name from the array passed in the function.
 * @param {array} arr - array of objects (primaryOptions or secondaryOptions).
 */
function createSchoolYearOptions(arr) {
    schoolYearDropDown.innerHTML = `<option value="default">-- Pick Year --</option>`;
    arr.forEach(item => {
        schoolYearDropDown.innerHTML += `<option value="year-${item.name.charAt(item.name.length -1)}">${item.name}</option>`;
    });
}

// On change event (when a new select value is selected) display activity cards matching the selected value.
schoolYearSelect.addEventListener('change', () => {
    // Checks which school level option is selected and returns the name of the option as a string.
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

/**
 * Calls deleteOldCards to remove any cards currently displayed.
 * Creates a new Document, then goes through each object in the array.
 * If the object's name key matches the value in the select element -
 * for each available class object creates a duplicate of the activity card template 
 * and replaces the content with the class object key values, then appends 
 * it to the page and calls updateAddBtn function.
 * If there are no class objects available, shows No Classes image.
 * @param {array} arr - array of objects.
 */
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
                }
                tempTemplateNode.querySelector('h3').textContent = year.classes[i].activity;
                tempTemplateNode.querySelector('.level span').textContent = year.classes[i].level;
                tempTemplateNode.querySelector('.schedule span').textContent = year.classes[i].schedule;
                tempTemplateNode.querySelector('.price span').textContent = year.classes[i].price;
                tempTemplateNode.querySelector('.tutor img').src = year.classes[i].tutor.image;
                tempTemplateNode.querySelector('.tutor-info h4').textContent = year.classes[i].tutor.name;
                tempTemplateNode.querySelector('.tutor-info p').textContent = year.classes[i].tutor.title;
                tempTemplateNode.querySelector('.activity-submit').addEventListener('click', () => {
                    if (sessionStorage.getItem(year.classes[i].activity) == 'enabled' && sessionStorage.getItem('btnsDisabled') !== 'true') {
                        addToCart(year.classes[i].activity, year.classes[i].price);
                    }
                });
                delete tempTemplateNode.dataset.type;
                tempTemplateNode.removeAttribute('aria-hidden');
                docFrag.appendChild(tempTemplateNode);
            }
        } else if (year.name == schoolYearSelect.options[schoolYearSelect.selectedIndex].text && year.classes.length == 0) {
            activityNoClassCard.style.display = "flex";
        }
    });
    activityCardsDiv.appendChild(docFrag);
    docFrag = null;
    updateAddBtn();
}

/**
 * Selects all activity cards, hides them 
 * and then deletes them if they don't have a data-type property.
 */
function deleteOldCards() {
    let activityCards = document.querySelectorAll('.activity-card');
    activityNoClassCard.style.display = "none";
    activityCards.forEach(card => {
        if (!card.hasAttribute('data-type')) {
            card.remove();
        }
    });
}

/**
 * Uses parameters to create a new HTML div element and add it to the booking cart,
 * then adds a click event listener to the X icon which calls removeFromCart function. Calls
 * updateCartTotal and updateAddBtn functions.
 * @param {string} className - name of class to be added to the booking cart.
 * @param {number} classPrice - price of class to be added to the booking cart.
 */
function addToCart(className, classPrice) {
    let selectedClass = `<div class="selected-class"><i class="fa-solid fa-xmark"></i>${className} <span>${classPrice}</span></div>`;
    sessionStorage.setItem(className, 'disabled');
    if (window.getComputedStyle(bookingCartContainer).display == 'none') {
        bookingCartContainer.style.display = 'flex';
    }
    bookingCart.innerHTML += selectedClass;
    bookingCart.querySelectorAll('.selected-class i').forEach(item => {
        item.addEventListener('click', (e) => {
            removeFromCart(e);
        });
    });
    updateCartTotal();
    updateAddBtn();
}

/**
 * Reset cart total value, then go through each cart div element, adds up the price, and returns and updates the total.
 */
function updateCartTotal() {
    subTotal = 0;
    bookingCartTotal.querySelector('span').innerHTML = "";
    bookingCart.querySelectorAll('.selected-class span').forEach(item => {
        let itemPrice = item.innerHTML.slice(1, item.innerHTML.length);
        if (!isNaN(itemPrice)) {
            subTotal += parseInt(itemPrice);
        }
    });
    bookingCartTotal.querySelector('span').innerHTML = "£" + subTotal;
}

/**
 * When called removes the element to which the 
 * event target belongs, subtracts the price, and sets the storage key 
 * to 'enabled' to re-enable the Add To Cart button.
 * Calls updateCartTotal and updateAddBtn functions.
 * @param {event} e - click event.
 */
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
    updateAddBtn();
}

/**
 * Checks sessionStorage keys and updates button state of all cards accordingly.
 * If btnsDisabled is true, disables all buttons.
 * If button specific key is disabled adds 'disabled'
 * property to button and changes content.
 * If none of the above are true enables the button and resets the text content.
 */
function updateAddBtn() {
    if (sessionStorage.getItem('btnsDisabled') == 'true') {
        document.querySelectorAll('.activity-submit').forEach(btn => {
            btn.disabled = true;
        });
    } else {
        document.querySelectorAll('.activity-submit').forEach(btn => {
            for (let i = 0; i < sessionStorage.length; i++) {
                if (sessionStorage.key(i) == btn.parentNode.firstElementChild.innerHTML) {
                    if (sessionStorage.getItem(sessionStorage.key(i)) === 'disabled') {
                        btn.disabled = true;
                        btn.innerHTML = 'Added';
                    } else {
                        btn.disabled = false;
                        btn.innerHTML = 'Add to Cart';
                    }
                }
            }
        });
    }
}

// On click sets btnsDisabled to true, collects
// and stores names of classes and turns them into a string,
// updates total of classes, then switches to mailing form
// and updates all buttons.
bookingCartSubmit.addEventListener('click', () => {
    if (bookingCart.childNodes.length == 0) return;
    sessionStorage.setItem('btnsDisabled', 'true');
    bookingCart.querySelectorAll('.selected-class').forEach(item => {
        bookedClasses = [];
        bookedClasses.push(item.innerHTML.slice(item.innerHTML.indexOf('</i>') + 4, item.innerHTML.indexOf('<span>') - 1));
    });
    order.classes = bookedClasses.length <= 1 ? bookedClasses.join(' & ') : bookedClasses.length > 1 ? bookedClasses.join(', ') : false;
    order.total = '£' + subTotal;
    showMailingForm();
    updateAddBtn();
});

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
 * Switches to mailing form as the active div 
 * in the booking cart and hides sibling.
 */
function showMailingForm() {
    mailingInfoDiv.classList.remove('hidden');
    selectSiblings(bookingCartContainer.children, mailingInfoDiv).forEach(div => {
        div.classList.add('hidden');
    });
}

/**
 * Switches to booking complete as the active div
 * in the booking cart and hides siblings.
 */
function showBookingComplete() {
    bookingCompleteDiv.classList.remove('hidden');
    selectSiblings(bookingCartContainer.children, bookingCompleteDiv).forEach(div => {
        div.classList.add('hidden');
    });
}

// On Submit button click checks if the name and e-mail address are valid and displays an error if they aren't.
// If valid - updates the order object name and email keys, and calls sendBookingConfirmation
// and showBookingComplete functions.
bookingCartContainer.querySelector('.send').addEventListener('click', () => {
    if (!mailingInfoEmailInput.validity.valid || !mailingInfoNameInput.validity.valid) {
        mailingInfoEmailInput.reportValidity();
        mailingInfoNameInput.reportValidity();
    } else if (isNameValid(mailingInfoNameInput.value)) {
        reportInvalidInput(mailingInfoEmailInput, 'name');
    } else if (!isEmailValid(mailingInfoEmailInput.value)) {
        reportInvalidInput(mailingInfoEmailInput, 'email');
    } else {
        order.name = mailingInfoNameInput.value;
        order.email = mailingInfoEmailInput.value;
        sendBookingConfirmation();
        showBookingComplete();
    }
});

// On Back button click hides mailing info form and re-enables booking cart.
bookingCartContainer.querySelector('.back').addEventListener('click', () => {
    sessionStorage.setItem('btnsDisabled', 'false');
    bookingCartDiv.classList.remove('hidden');
    selectSiblings(bookingCartContainer.children, bookingCartDiv).forEach(div => {
        div.classList.add('hidden');
    });
    updateAddBtn();
});

/**
 * Additional e-mail validation function. This function ensures the e-mail
 * address contains an 'at' symbol and Top-Level Domain.
 * @param {string} email - e-mail address as a string.
 * @returns boolean value depending on whether the email param matches the RegExp.
 */
function isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


//https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces
/**
 * Additional name validation function. This function ensures the name
 * does not consist of space-only characters.
 * @param {string} name - name as a string.
 * @returns boolean value depending on whether the name contains only spaces.
 */
function isNameValid(name) {
    return name.replace(/\s/g, '').length === 0;
}

/**
 * Insert an error paragraph to alert missing Top-Level Domain in the e-mail address added.
 * Paragraph is inserted as the next sibling of the passed HTMLDivElement.
 * @param {HTMLDivElement} insertAfterNode - element after which the error should be inserted.
 */
function reportInvalidInput(insertAfterNode, input) {
    if (!document.querySelector('.error') === false) {
        document.querySelector('.error').remove();
    }
    const error = document.createElement('p');
    error.classList.add('error');
    if (input == 'name') {
        error.innerText = 'Your name cannot contain spaces only!';
    } else if (input == 'email') {
        error.innerText = 'Your e-mail address is missing its TLD (.com, .co.uk, etc.)';
    }
    insertAfterNode.parentElement.insertBefore(error, insertAfterNode.nextSibling);
}

/**
 * Sends an e-mail using emailJS passing the values of the order object.
 */
function sendBookingConfirmation() {
    emailjs.send('service_sl1lvmo', 'template_0xcih7k', order, 'uwUMF7skPiFP9wOGF')
    .then(response => {
        return response.status;
    })
}

// Listener to prevent default behavior of Newsletter form submit button
// and instead send an email using signUpConfirm function.
document.getElementById('newsletter-form-container').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!newsletterNameInput.validity.valid || !newsletterEmailInput.validity.valid) {
        mailingInfoEmailInput.reportValidity();
        mailingInfoNameInput.reportValidity();
    } else if (isNameValid(newsletterNameInput.value)) {
        reportInvalidInput(newsletterSelect, 'name');
    } else if (!isEmailValid(newsletterEmailInput.value)) {
        reportInvalidInput(newsletterSelect, 'email');
    } else {
        signUpConfirm(e.target);
        e.target.submit();
    }
});

/**
 * Sends an e-mail using emailJS passing the values of the newsletter form.
 */
function signUpConfirm(form) {
    emailjs.sendForm('service_sl1lvmo', 'template_zf090ar', form, 'uwUMF7skPiFP9wOGF')
    .then(response => {
        return response.status;
    })
}

// Commented out module exports to prevent ReferenceError from being thrown.
export default {
    order,
    displaySchoolYearOptions,
    createSchoolYearOptions,
    displayClasses,
    deleteOldCards,
    addToCart,
    updateCartTotal,
    removeFromCart,
    updateAddBtn,
    showMailingForm,
    showBookingComplete,
    isEmailValid,
    isNameValid,
    reportInvalidInput, 
    sendBookingConfirmation, 
    signUpConfirm
}