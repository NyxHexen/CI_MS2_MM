/**
 * @jest-environment jsdom
 */
require('jest-fetch-mock').enableMocks();

let order, displaySchoolYearOptions, createSchoolYearOptions, displayClasses, deleteOldCards, addToCart, updateCartTotal, removeFromCart, updateAddBtn, showMailingForm, showBookingComplete, isEmailValid, isNameValid, reportInvalidInput, sendBookingConfirmation, signUpConfirm;

const trigger = (el, etype) => {
    const evt = new Event(etype, {
        bubbles: true
    });
    el.dispatchEvent(evt);
    return evt;
};

let mockOptionsArr = [{
    name: "Test Year 1",
    classes: [{
        activity: "Test Activity 1",
        level: "Test Level",
        schedule: "Test Time",
        price: "123.45",
        tutor: {
            image: "Test Image",
            name: "Test Tutor",
            title: "Test Title"
        }
    }]
}]

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("booking.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

    order = require("../booking.js").order;
    displaySchoolYearOptions = require("../booking.js").displaySchoolYearOptions;
    createSchoolYearOptions = require("../booking.js").createSchoolYearOptions;
    displayClasses = require("../booking.js").displayClasses;
    deleteOldCards = require("../booking.js").deleteOldCards;
    addToCart = require("../booking.js").addToCart;
    updateCartTotal = require("../booking.js").updateCartTotal;
    removeFromCart = require("../booking.js").removeFromCart;
    updateAddBtn = require("../booking.js").updateAddBtn;
    showMailingForm = require("../booking.js").showMailingForm;
    showBookingComplete = require("../booking.js").showBookingComplete;
    isEmailValid = require("../booking.js").isEmailValid;
    isNameValid = require("../booking.js").isNameValid;
    reportInvalidInput = require("../booking.js").reportInvalidInput;
    sendBookingConfirmation = require("../booking.js").sendBookingConfirmation;
    signUpConfirm = require("../booking.js").signUpConfirm;
})

afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
})

describe("Check objects exist", () => {
    test("Check order object exists", () => {
        expect(order.classes).toBe("");
        expect(order.email).toBe("");
        expect(order.name).toBe("");
        expect(order.total).toBe(0);
    })
})

describe("Test createSchoolYearOptions() functionality", () => {
    test("Function takes in array and creates select options using name key", () => {
        createSchoolYearOptions(mockOptionsArr);
        expect(document.querySelector('#school-year-select').innerHTML).toContain('-- Pick Year --');
        expect(document.querySelector('#school-year-select').innerHTML).toContain('Test Year 1');
    })
})

describe("Test displaySchoolYearOptions() functionality", () => {
    test("Function clears select default value and creates new select options",() => {
        displaySchoolYearOptions(trigger(document.querySelectorAll('.booking-radio')[0], 'click'));
        expect(document.querySelector('.school-year select').innerHTML).toContain('Year 3');
    })
    test("Function clears select default value and creates new select options",() => {
        displaySchoolYearOptions(trigger(document.querySelectorAll('.booking-radio')[1], 'click'));
        expect(document.querySelector('.school-year select').innerHTML).toContain('GCSE');
    })
})

describe("Test displayClasses() functionality", () => {
    test("Uses local array of objects to create class cards using object key values and template", () => {
        document.querySelector('.school-year select').options[0].innerHTML = mockOptionsArr[0].name;
        displayClasses(mockOptionsArr);
        expect(document.querySelectorAll('.activity-card')[0].innerHTML).toContain('Activity Card Template');
        expect(document.querySelectorAll('.activity-card h3')[1].innerHTML).toContain('Test Activity');
    })
})

describe("Test deleteOldCards() functionality", () => {
    test("Function deletes all generated activity cards except no-class-card and activity-card template", () => {
        expect(document.querySelectorAll('.activity-card').length).not.toBe(1);
        deleteOldCards();
        expect(document.querySelectorAll('.activity-card').length).toBe(1);
    })
})

describe("Test addToCart() functionality", () => {
    test("Booking cart is updated with a div containing an icon, class name, and price", () => {
        expect(document.querySelectorAll('.selected-class').length).toBe(0);
        addToCart('Test Activity 1', '£100');
        addToCart('Test Activity 2', 'Free');
        expect(document.querySelectorAll('.selected-class').length).toBe(2);
        expect(document.querySelectorAll('.selected-class')[0].innerHTML).toContain('<i class="fa-solid fa-xmark"></i>');
        expect(document.querySelectorAll('.selected-class')[0].innerHTML).toContain('Test Activity 1');
        expect(document.querySelectorAll('.selected-class span')[0].innerHTML).toBe('£100');
        expect(document.querySelectorAll('.selected-class')[1].innerHTML).toContain('<i class="fa-solid fa-xmark"></i>');
        expect(document.querySelectorAll('.selected-class')[1].innerHTML).toContain('Test Activity 2');
        expect(document.querySelectorAll('.selected-class span')[1].innerHTML).toBe('Free');
    })
    test("Function creates sessionStorage key using first parameter and sets it to disabled", () => {
        expect(sessionStorage.getItem('Test Activity 1')).toBe('disabled');
        expect(sessionStorage.getItem('Test Activity 2')).toBe('disabled');
    })
})

describe("Test updateCartTotal() functionality", () => {
    test("Called by addToCart, function sums price of each generated cart item and updates total div", () => {
        expect(document.querySelector('.booking-cart-total span').innerHTML).toBe('£100');
        addToCart('Test Class Name 3', '£200');
        expect(document.querySelector('.booking-cart-total span').innerHTML).toBe('£300');
    })
})

describe("Test removeFromCart() functionality", () => {
    test("When cart item icon is clicked it removes the item from cart", () => {
        removeFromCart(trigger(document.querySelectorAll('.booking-cart i')[0], 'click'));
        expect(document.querySelectorAll('.selected-class').length).toBe(2);
    })
    test("When item is removed, corresponding sessionStorage key is updated", () => {
        expect(sessionStorage.getItem('Test Activity 1')).toBe('enabled');
    })
    test("Function updates cart total after removing item", () => {
        expect(document.querySelector('.booking-cart-total span').innerHTML).toBe('£200');
    })
})

describe("Test updateAddBtn() functionality", () => {
    beforeAll(() => {
        sessionStorage.clear();
        document.querySelector('.school-year select').options[0].innerHTML = mockOptionsArr[0].name;
        displayClasses(mockOptionsArr);
        addToCart('Test Activity 1', 'enabled');
    })
    test("If btnsDisabled sessionStorage key is false, sessionStorage key is checked and buttons updated accordingly", () => {
        expect(document.querySelectorAll('.activity-submit')[0].disabled).toBe(false);
        expect(document.querySelectorAll('.activity-submit')[1].disabled).toBe(true);
    })
    test("If btnsDisabled sessionStorage key is true, disable all Add To Cart buttons", () => {
        sessionStorage.setItem('btnsDisabled', 'true');
        updateAddBtn();
        expect(document.querySelectorAll('.activity-submit')[0].disabled).toBe(true);
        expect(document.querySelectorAll('.activity-submit')[1].disabled).toBe(true);
    })
})

describe("Test showMailingForm() functionality", () => {
    test("Function shows mailing form and hides siblings", () => {
        showMailingForm();
        expect(document.querySelector('.booking-cart-div').classList).toContain('hidden');
        expect(document.querySelector('.mailing-info-div').classList).not.toContain('hidden');
        expect(document.querySelector('.booking-complete-div').classList).toContain('hidden');
    })
})

describe("Test bookingComplete() functionality", () => {
    test("Function shows booking complete div and hides siblings", () => {
        showBookingComplete();
        expect(document.querySelector('.booking-cart-div').classList).toContain('hidden');
        expect(document.querySelector('.mailing-info-div').classList).toContain('hidden');
        expect(document.querySelector('.booking-complete-div').classList).not.toContain('hidden');
    })
})

describe("Test isEmailValid() functionality", () => {
    test("Function should return false if e-mail passed doesn't contain TLD", () => {
        expect(isEmailValid('test@test')).toBe(false);
    })
    test("Function should return true if e-mail passed is valid", () => {
        expect(isEmailValid('test@test.com')).toBe(true);
    })
})

describe("Test isNameValid() functionality", () => {
    test("Function should return true if contains only spaces", () => {
        expect(!isNameValid('   ')).toBe(false);
    })
    test("Function should return false if name passed is valid", () => {
        expect(!isNameValid('Nyx Hexen')).toBe(true);
    })
})

describe("Test reportInvalidInput() functionality", () => {
    test("If param passed is 'name' - creates and attaches error element showing name is only spaces", () => {
        reportInvalidInput(document.querySelector('#newsletter-findus'), 'name');
        expect(document.querySelector('.error').innerText).toBe("Your name cannot contain spaces only!");
    })
    test("If param passed is 'email' - creates and attaches error element showing email is missing TLD", () => {
        reportInvalidInput(document.querySelector('#newsletter-findus'), 'email');
        expect(document.querySelector('.error').innerText).toBe("Your e-mail address is missing its TLD (.com, .co.uk, etc.)");
    })
    test("Function deletes previous error before attaching new one", () => {
        reportInvalidInput(document.querySelector('#newsletter-findus'), 'email');
        reportInvalidInput(document.querySelector('#newsletter-findus'), 'email');
        reportInvalidInput(document.querySelector('#newsletter-findus'), 'email');
        expect(document.querySelectorAll('.error').length).toBe(1);
    })
})
