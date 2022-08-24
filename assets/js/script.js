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

modalContainer.addEventListener('click', (e) => {
    modalContainer.classList.toggle('out');
});

// Carousel - index.html

