const schoolLevelOption = document.querySelectorAll('.booking-radio');
const schoolYearDiv = document.querySelector('.school-year');
const schoolYearDropDown = document.querySelector('#school-year-select');
const schoolYearButtons = document.querySelector('#school-year-btns');
const schoolYearSelect = document.querySelector('.school-year select');
const activityCardsDiv = document.querySelector('#activity-cards');
const activityCardTemplate = document.querySelector("div[data-type='template']");
const activityNoClassCard = document.querySelector('.no-class-card');

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
        activity: "Year 7 Preparation - <br> End of Year",
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
    let selectedLevel = schoolLevelOption[0].checked 
        ? Object.keys({primaryOptions})[0] 
        : schoolLevelOption[1].checked 
        ? Object.keys({secondaryOptions})[0] 
        : false;
    if (selectedLevel === 'primaryOptions') {
        displayClasses(primaryOptions);
    } else if (selectedLevel === 'secondaryOptions') {
        displayClasses(secondaryOptions);
    }
}, false);

function displayClasses(arr) {
    deleteOldCards();
    let docFrag = document.createDocumentFragment();
    //https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
    arr.forEach(year => {
        if (year.name == schoolYearSelect.options[schoolYearSelect.selectedIndex].text && year.classes.length != 0) {
            for (let i = 0; i < year.classes.length; i++) {
                let tempTemplateNode = activityCardTemplate.cloneNode(true);
                tempTemplateNode.querySelector('h4').textContent = year.classes[i].activity;
                tempTemplateNode.querySelector('.level span').textContent = year.classes[i].level;
                tempTemplateNode.querySelector('.schedule span').textContent = year.classes[i].schedule;
                tempTemplateNode.querySelector('.price span').textContent = year.classes[i].price;
                tempTemplateNode.querySelector('.tutor img').src = year.classes[i].tutor.image;
                tempTemplateNode.querySelector('.tutor-info h5').textContent = year.classes[i].tutor.name;
                tempTemplateNode.querySelector('.tutor-info p').textContent = year.classes[i].tutor.title;
                tempTemplateNode.style.display = 'flex';
                delete tempTemplateNode.dataset.type;
                docFrag.appendChild(tempTemplateNode);
            }
        } else if (year.name == schoolYearSelect.options[schoolYearSelect.selectedIndex].text && year.classes.length == 0){
            activityNoClassCard.style.display = "flex";
        }
    })
    activityCardsDiv.appendChild(docFrag);
    delete docFrag;
}

function deleteOldCards() {
    let activityCards = document.querySelectorAll('.activity-card');
    activityNoClassCard.style.display = "none";
    activityCards.forEach(card => {
        if (!card.hasAttribute('data-type')){
            card.remove();
        }
    })
}