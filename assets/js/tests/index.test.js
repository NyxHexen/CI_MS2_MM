/**
 * @jest-environment jsdom
 */

const {
    beforeAll
} = require('jest-circus');
const {
    nextSlide
} = require('../index');

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
})

describe("nextSlide works correctly", () => {
    test('Test Test', () => {
        let carouselIndex = 0;
        nextSlide();
        expect(carouselIndex).toBe(1);
    })
})