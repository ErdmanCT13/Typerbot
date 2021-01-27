const Typist = require("./Typist.js");





test("Move a specified number of cursor positions", async () => {
    var testString = "hello, this is a test string! Here's some move text"
    var testElement = document.createElement("div")
    var testTypist = new Typist(testElement, {keystrokeInterval: 10});
    await testTypist.type(testString);
    expect(testTypist.getCursorPosition()).toBe(testString.length);
    // await testTypist.move(-10)
    // expect(testTypist.getCursorPosition()).toBe(testString.length - 10);
});
test("Delete a specified number of cursor positions", async () => {
    var testString = "hello, this is a test string! Here's some move text"
    var testElement = document.createElement("div")
    var testTypist = new Typist(testElement, {keystrokeInterval: 10});
    await testTypist.type(testString);
    expect(testTypist.getCursorPosition()).toBe(testString.length);
    await testTypist.move(-10)
    expect(testTypist.getCursorPosition()).toBe(testString.length - 10)
    await testTypist.delete(10)
    expect(testTypist.getCursorPosition()).toBe(testString.length - 20);
});
test("Test Move to Start", async () => { // 
    var testString = "hello, this is a test string! Here's some move text"
    var testElement = document.createElement("div")
    var testTypist = new Typist(testElement, {keystrokeInterval: 10});
    await testTypist.type(testString);
    expect(testTypist.getCursorPosition()).toBe(testString.length);
    await testTypist.moveToStart()
    expect(testTypist.getCursorPosition()).toBe(0);
});
test("Test Move to end", async () => { // 
    var testString = "hello, this is a test string! Here's some move text"
    var testElement = document.createElement("div")
    var testTypist = new Typist(testElement, {keystrokeInterval: 10});
    await testTypist.type(testString);
    expect(testTypist.getCursorPosition()).toBe(testString.length);
    await testTypist.moveToStart()
    expect(testTypist.getCursorPosition()).toBe(0);
    await testTypist.moveToEnd()
    expect(testTypist.getCursorPosition()).toBe(testString.length)
});
test("Test Move to Start", async () => { // 
    var testString = "hello, this is a test string! Here's some move text"
    var testElement = document.createElement("div")
    var testTypist = new Typist(testElement, {keystrokeInterval: 10});
    await testTypist.type(testString);
    expect(testTypist.getCursorPosition()).toBe(testString.length);
    await testTypist.moveToStart()
    expect(testTypist.getCursorPosition()).toBe(0);
});
