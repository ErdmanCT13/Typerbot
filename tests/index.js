import Typist from "./typerbot.js/index.js.js"

(async () => {
    
    var test = new Typist(document.querySelector(".test"),{
        keystrokeInterval: (typist) => {
            return Math.random() * 200
        }
    })
    await test.type("Hey Stacey, isn't this cool?!!?")
    await test.type(" Here's some more text for you!")
    await test.move(-10)
    await test.deleteAll()

})();