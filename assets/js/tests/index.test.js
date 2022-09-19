/**
 * @jest-environment jsdom
 */

let jestTest, nextSlide, activeState, selectedState, clearState;

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

    jestTest = require("../index.js").jestTest;
    nextSlide = require('../index.js').nextSlide;
    activeState = require("../index.js").activeState;
    selectedState = require("../index.js").selectedState;
    clearState = require("../index.js").clearState;
})

describe("Test that Jest is working correctly", () => {
    test("should return 12", () => {
        expect(jestTest()).toBe(12);
    });
});

describe("Test page functionality", () => {
    test("nextSlide() should return 1 after 1st call", () => {
        expect(nextSlide()).toBe(1);
    });
    test("nextSlide() should return 2 after 2st call", () => {
        expect(nextSlide()).toBe(2);
    });
    test("nextSlide() should return 0 after 3rd call", () => {
        expect(nextSlide()).toBe(0);
    });
    test("clearState removes 'active' class from all tabs and slides", () => {
        clearState();
        expect(document.querySelectorAll('.tab')[0].classList.contains('active')).toBe(false);
        expect(document.querySelectorAll('.tab')[1].classList.contains('active')).toBe(false);
        expect(document.querySelectorAll('.tab')[2].classList.contains('active')).toBe(false);
        expect(document.querySelectorAll('.carousel-slide')[0].classList.contains('active')).toBe(false);
        expect(document.querySelectorAll('.carousel-slide')[1].classList.contains('active')).toBe(false);
        expect(document.querySelectorAll('.carousel-slide')[2].classList.contains('active')).toBe(false);
    });
    test("activeState correctly assigns clicked item as active", () => {
        activeState(1);
        expect(document.querySelectorAll('.tab')[1].classList.contains('active')).toBe(true);
        expect(document.querySelectorAll('.carousel-slide')[1].classList.contains('active')).toBe(true);
    });
    test("selectedState correctly assigns clicked item as active", () => {
        const trigger = (el, etype) => {
            const evt =  new Event( etype, { bubbles: true } );
            el.dispatchEvent(evt);
            return evt;
          };
        selectedState(trigger(document.querySelectorAll('.tab')[2], 'click'));
        expect(document.querySelectorAll('.tab')[2].classList.contains('active')).toBe(true);
        expect(document.querySelectorAll('.carousel-slide')[2].classList.contains('active')).toBe(true);
    });
});
