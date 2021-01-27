import Typist from "./Typist.js"

(async () => {
    var test = new Typist(document.querySelector(".test"),{
        keystrokeInterval: (typist) => {
            return Math.random() * 100
        }
    })
})();