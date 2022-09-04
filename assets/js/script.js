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
if (window.location.pathname === '/index.html') {
    const carousel = document.getElementById('carousel');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselTabs = document.querySelectorAll('.tab');

    let carouselIndex = 0;

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