const schoolLevelOption = document.querySelectorAll('.booking-radio');
const schoolYearDiv = document.querySelector('.school-year');
const schoolYearDropDown = document.querySelector('#school-year-select');
const schoolYearButtons = document.querySelector('#school-year-btns');

const primaryOptions = [{
    name: "Year 1",
    classes: [{
        activity: "Calculation Skills",
        level: "Beginner",
        schedule: "Every Tuesday, 5:30pm - 6.10pm",
        price: "£" + 40,
        tutor: {
            image: "assets/",
            name: "Dess Ilieva",
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
            image: "assets/",
            name: "Bella Goth",
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
            image: "assets/",
            name: "Geralt of Rivia",
            title: "Tutor"
        }
    }, {
        activity: "Entry Mock Exam II",
        level: "Everybody welcome!",
        schedule: "15/09/2022, 7:30pm - 8:30pm",
        price: "Free",
        tutor: {
            image: "assets/",
            name: "Yennefer of Vengerberg",
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
            image: "assets/",
            name: "Proventus Avenicci",
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
            image: "assets/",
            name: "Dess Ilieva",
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
            image: "assets/",
            name: "Dess Ilieva",
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
    const dropDownShow = `<button type="submit" class="show-classes">Show Classes</button>`;
    if (window.getComputedStyle(schoolYearDropDown).display !== 'none') {
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