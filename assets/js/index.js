// Carousel
const carousel = document.getElementById('carousel');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselTabs = document.querySelectorAll('.tab');
// Methodology
const methods = document.querySelectorAll('.method');
// Legal Modal
const modalContainer = document.querySelector('#modal-container');
const modalHeading = document.querySelector('.modal').childNodes[1];
const modalText = document.querySelector('.modal').childNodes[3];
const legalButtons = document.querySelectorAll('.legal-button');
const legalSwitch = [{
    "h2": "TERMS OF USE",
    "text": `
<h3> 1. Right to Access </h3>
<p> We grant you a limited, nonexclusive, nontransferable right to access this Site and its content for your
personal, noncommercial use according to these Terms of Use.If you are under age 18, you may use this Site only
with your parents or guardian
s consent.</p>
<br>
<p>Availability.We shall use commercially reasonable efforts to provide continuous access to the Site.We do not
guarantee that the Site will be accessible at all times.The Site may be unavailable during maintenance periods
or during an emergency.In addition to normal maintenance,
there may be events that will make the Site inaccessible for a limited amount of time due to unforeseen
circumstances.</p>
<br>
<h3> 2. Limits of Your Use </h3>
<p>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
</p>
<ul>
<li>In any way that violates any applicable federal, state, local or international law or regulation (including,
    without limitation, any laws regarding the export of data or software to and from the US or other
    countries).</li>
<li>For the purpose of exploiting, harming or attempting to exploit or harm minors in any way by exposing them
    to inappropriate content, asking for personally identifiable information or otherwise.</li>
<li>To transmit, or procure the sending of, any advertising or promotional material without our prior written
    consent, including any “junk mail”, “chain letter” or“ spam” or any other similar solicitation.</li>
<li>To impersonate or attempt to impersonate us, our employees, another user or any other person or
    entity(including, without limitation, by using e - mail addresses or screen names associated with any of the
    foregoing).</li>
<li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Site, or which,
    as determined by us, may harm us or users of the Site or expose them to liability.</li>
</ul>
<br>
<h3>3. Additionally, you agree not to:</h3>
<ul>
<li>Use the Site in any manner that could disable, overburden, damage, or impair the Site or interfere with any
    other party's use of the Site, including their ability to engage in real time activities through the Site.
</li>
<li>Use any robot, spider or other automatic device, process or means to access the Site for any purpose,
    including monitoring or copying any of the material on the Site.</li>
<li>Use any device, software or routine that interferes with the proper working of the Site.</li>
<li>Introduce any viruses, Trojan horses, worms, logic bombs or other material which is malicious or
    technologically harmful.</li>
<li>Attempt to gain unauthorized access to, interfere with, damage or disrupt any parts of the Site, the server
    on which the Site is stored, or any server, computer or database connected to the Site.</li>
<li>Attack the Site via a denial-of-service attack or a distributed denial-of-service attack.</li>
<li>Otherwise attempt to interfere with the proper working of the Site.</li>
</ul>
<br>
<h3>4. Privacy</h3>
<p>Personal Information.We will maintain and use your“ Personal Information” as defined in, and according to our
Privacy Policy, and which may be modified from time to time in our discretion, which modifications are effective
as of the date posted on our Site.Your continued access or use of the Site or purchase or use of our Services
indicates that you agree with such modifications.</p>`
}, {
    "h2": "PRIVACY POLICY",
    "text": `
<h3>What Information Does This Privacy Policy Cover?</h3>
<br>
<p>This Privacy Policy covers our treatment of personally identifiable information. Such  information may include name, mailing address, email address, telephone number, and other  information which identifies you as a specific individual ("Personal Information"). Please see  additional information below on the information we collect. For this Privacy Policy the definition  of “Personal Information” is the definition under the state, country, or other law applicable to the  person whose data is collected. For California residents only, “Personal Information” shall have  the definition as set forth in the California Consumer Privacy Act of 2018 (“CCPA”). Please see  the section below entitled “Privacy Notice for California Residents” for more information. If you  are a citizen or resident of the European Economic Area, United Kingdom, or Switzerland, the  definition of personal information ("personal data") is defined under GDPR and you have certain rights; therefore, please see the section below entitled "GDPR".</p>`
}];

let carouselIndex = 0;
let carouselInterval;

// Hamburger Button
['click', 'keydown'].forEach(ev => {
    document.querySelector('.hamburger-menu-button').addEventListener(ev, function () {
        document.querySelector('.nav-links-container').classList.toggle('active');
    });
});

// Methodology
methods.forEach(method => {
    method.addEventListener('click', () => {
        method.classList.toggle('active');
    });
});

//Modal #Legal
// Depending on which button is clicked (Terms & Conditions or Privacy Policy) the content of the modal changes.
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
    });
});

modalContainer.addEventListener('click', () => {
    modalContainer.classList.toggle('out');
});


// As index.js is used on each of the pages of the website we make sure that the below runs only on index.html
if (
    window.location.pathname === '/CI_MS2_MM/' ||
    window.location.pathname === '/CI_MS2_MM/index.html' ||
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html'
) {
    // https://www.byteblocks.com/Post/Use-addEventListener-or-attachEvent-for-windowonload-event
    // Instead of reassigning the event handler we use addEvent to add to the event handlers chain.
    window.addEventListener ?
        window.addEventListener("load", startCarousel(), false) :
        window.attachEvent && window.attachEvent("onload", startCarousel());

    // On hover stop the timers
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    // On mouse leave restart the timer
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });

    // On tab click - focus slide
    carouselTabs.forEach(tab => {
        tab.addEventListener('click', selectedState);
    });
}

/**
 * Used to assign setInterval to carouselInterval variable 
 * once the page loads to prevent the Interval from starting before that.
 */
function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
}

/**
 * nextSlide starts and progresses the carousel to the next tab and slide.
 * It first clears any active classes from the HTML elements using clearState func,
 * adds 1 to the carouselIndex variable and calls activeState func with the variable as a parameter.
 * This func takes no parameters.
 */
function nextSlide() {
    clearState();
    if (carouselIndex === carouselSlides.length - 1) {
        carouselIndex = 0;
    } else {
        carouselIndex++;
    }
    activeState(carouselIndex);
    return carouselIndex;
}


/**
 * clearState cycles through each tab and slide and removes the 'active' class.
 * This function takes no parameters.
 */
function clearState() {
    carouselTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    carouselSlides.forEach(slide => {
        slide.classList.remove('active');
    });
}

/**
 * activeState takes an index and adds 'active' class to the corresponding HTML element.
 * @param {number} index - corresponds to the index of the carousel tabs and slides arrays.
 */
function activeState(index) {
    carouselTabs[index].classList.add('active');
    carouselSlides[index].classList.add('active');
}

/**
 * selectedState removes all classes from tabs and slides, uses a Regular Expression to 
 * find the index of the the event target inside the carousel tabs array, 
 * then calls activeState func using the index as parameter and reassigns the carouselIndex variable to the index.
 * @param {event} e - takes on click event as parameter.
 */
function selectedState(e) {
    clearState();
    const selectedTab = e.target.classList.value;
    // activeIndex is assigned to a RegExp to extract specific text from a string
    // https://stackoverflow.com/questions/41515234/extract-a-specific-word-from-string-in-javascript
    const activeIndex = selectedTab.match(/tab-(\d)/)[1];
    activeState(activeIndex - 1);
    carouselIndex = activeIndex - 1;
}

// Commented out module exports to prevent ReferenceError from being thrown.
// module.exports = {
//     nextSlide,
//     activeState,
//     selectedState,
//     clearState
// }