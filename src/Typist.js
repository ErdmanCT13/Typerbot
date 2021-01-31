class Typist {
    constructor(fieldElement, options) {
        this._fieldElement = (fieldElement || options.fieldElement) || (function () {
            throw new Error("No element provided")
        })()
        this._settings = options ? Object.assign(Typist.defaultSettings(), options) : Typist.defaultSettings()
        this._characterEntries = this._splitUpTextNodes(this._fieldElement) || []
        this._cursorPosition = this._characterEntries.length
        this._cursorElement = document.createElement("span")
        //this._cursorElement.style.position = "absolute"
        this._cursorBlink = null
        this._cursorBlinkTimeout = null
        this._cursorElement.appendChild(document.createTextNode("|"))
        this._cursorElement.classList.add(this._settings.cursorClass)
        this._fieldElement.appendChild(this._cursorElement)
        if (!this._settings.cursor) {
            this._cursorElement.style.visibility = "hidden"
            //console.log("CURSOR IS HIDDEN")
        }
        else {
            this._calculateCursorMargins()
            this._startCursorBlink()
        }
    }
    getCursorPosition(){
        return this._cursorPosition
    }
    getCharacterEntries(){
        return this._characterEntries
    }
    _parseHTMLString(string) { // let the browser do our work for us 
        var template = document.createElement("template")
        template.innerHTML = string
        return template.content
    }
    _getNextTextOrHTMLNode(node) {
        if (!node.nextSibling) {
            return null
        } // if there is no next sibling return null
        var currentNode = node.nextSibling
        while (!(currentNode instanceof HTMLElement) && !(currentNode instanceof Text)) { // while next node isn't an element or a text node keep going
            currentNode = currentNode.nextSibling // move to the next node in the list 
        }
        return currentNode
    }
    _splitUpTextNodes(element) { // the goal of this function is to take any existing text nodes inside the _fieldElement and split them up into iterable single character text nodes
        ////console.log(element)
        var characterEntries = []
        Array.from(element.childNodes).forEach((node) => { // for each entry, recursively break up all of the text nodes into individual single character text nodes
            ////console.log("current node", node)
            if (node instanceof Text) {
                node.nodeValue = node.nodeValue.replaceAll(/(\s)+/g, " ") // remove the extra whitespace from the node
                // any tabs in the markup with be translated into spaces that will appear in our string
                // sometimes after the replace all regex is evaluated, there will be extraneous whitespace at the start and end of the nodeValue. This should be removed to avoid weird behavior
                if (node.nodeValue[node.nodeValue.length - 1] == " ") { node.nodeValue = node.nodeValue.substring(0, node.nodeValue.length - 1) } // if the string ends with a space remove it
                if (node.nodeValue[0] == " ") { node.nodeValue = node.nodeValue.substring(1, node.nodeValue.length) } // if the string starts with a space remove it
                var nextTextOrHTMLNode = this._getNextTextOrHTMLNode(node) // save a reference to the next node so we can use it with element.insertBefore
                ////console.log(this._getNextTextOrHTMLNode(node))
                node.parentNode.removeChild(node)
                Array.from(node.nodeValue).forEach((character) => {
                    var newTextNode = document.createTextNode(character)
                    characterEntries.push(newTextNode)
                    if (!nextTextOrHTMLNode) {
                        element.insertBefore(newTextNode, nextTextOrHTMLNode)
                    } else {
                        element.appendChild(newTextNode)
                    }
                })
            } else if (node instanceof HTMLElement) {
                characterEntries.concat(this._splitUpTextNodes(node)) // split up textNodes inside this element too
            }
        })
        return characterEntries
    }
    _beginBlinkStartTimeout() {
        if (!this._settings.cursor) { return }
        if (this._cursorBlinkTimeout) {
            return
        } // if the cursorBlinkTimeout is already set we don't need to set it again
        this._cursorBlinkTimeout = setTimeout(() => {
            this._cursorBlinkTimeout = null
            this._startCursorBlink()
        }, 100)
    }
    _clearBlinkStartTimeout() { // at the end of an input we should clear the timeout so the cursor doesnt start blinking prematurely
        clearTimeout(this._cursorBlinkTimeout)
        this._cursorBlinkTimeout = null
    }
    _startCursorBlink() {
        if (!this._settings.cursor) { return }
        var cursorOn = true
        if (this._cursorBlink) {
            return
        } // if the interval is already running then we dont need to start it again
        this._cursorElement.style.visibility = "visible"
        this._cursorBlink = setInterval(() => {
            this._cursorElement.style.visibility = cursorOn ? "hidden" : "visible"
            cursorOn = cursorOn ? false : true
        }, this._settings.cursorBlinkInterval)
    }
    _stopCursorBlink() {
        clearInterval(this._cursorBlink)
        this._cursorBlink = null
    }
    _calculateCursorMargins() {
        var cursorElementWidth = this._cursorElement.getBoundingClientRect().width
        this._cursorElement.style.margin = `0 ${-.6 * cursorElementWidth}px 0 ${-.4 * cursorElementWidth}px`
    }
    updateSettings(options) { // overwrite current settings with provided user settings
        Object.assign(this._settings, options)
    }
    updateSettings(options) { // overwrite current settings with provided user settings
        Object.assign(this._settings, options)
    }
    resetSettings() { // reset to library default settings
        this._settings = this.defaultSettings()
    }
    getSettings() {
        return this._settings
    }
    static defaultSettings() {
        return {
            keystrokeInterval: 200,
            keystrokeDelay: 0,
            cursorBlinkInterval: 800,
            delayDuration: 0,
            pauseDuration: 1000,
            cursorClass: "typist-cursor",
            animation: true,
            refreshCursorOnWindowResize: false,
            html: true,
            cursor: true,
            cursorString: "|",
            afterLineComplete: () => {},
            beforeLineComplete: () => {},
            beforeKeyInput: () => {},
            afterKeyInput: () => {},
            afterComplete: () => {}
        }
    }

    async pause(milliseconds) { // takes in a time in milliseconds
        // console.log("paused for", milliseconds)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            },
                (() => {
                    if (typeof milliseconds == "number") {
                        return Math.abs(Math.floor(milliseconds))
                    }
                    if (typeof this._settings.pauseDuration == "number") {
                        return Math.abs(Math.floor(this._settings.pauseDuration))
                    } else {
                        throw new Error("Typist.pause only accepts number inputs")
                    }
                })()
            )
        })
    }

    async type(string, options) { // like type but it takes in an element and recursively outputs textnodes at every element layer
        if (typeof string != "string") { throw new Error("Typist.type only accepts string values at positon 1") };
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options);
        var fragment;
        if (settings.html) { fragment = this._parseHTMLString(string) }
        else {
            fragment = document.createElement("template");
            fragment.appendChild(string);
        }

        this._beginBlinkStartTimeout();
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay); // delay
        this._stopCursorBlink();

        var fragmentChildren = [];
        Array.from(fragment.childNodes).forEach(child => {
            fragmentChildren.push(child)
        })
        for (var i = 0; i < fragmentChildren.length; i++) {
            await this._typeNodeContents(fragmentChildren[i], settings)
        }
    }

    async _typeNodeContents(node, settings) {
        if (node instanceof Text) {
            //console.log("FOUND A TEXT NODE", node)
            for (var j = 0; j < node.nodeValue.length; j++) {

                this._clearBlinkStartTimeout()
                this._beginBlinkStartTimeout()

                var characterEntryTextNode = document.createTextNode(node.nodeValue[j])
                this._cursorElement.parentNode.insertBefore(characterEntryTextNode, this._cursorElement)
                this._characterEntries.splice(this._cursorPosition++, null, characterEntryTextNode) // add textNode to characterEntries array
                //console.log("HERE ARE THE SETTINGS", settings)
                await this.pause(typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval)
            }
            return // if we find a text node we exit this function call
        }
        // insert the element into the dom

        var childNodes = []
        Array.from(node.childNodes).forEach((child) => {
            childNodes.push(node.removeChild(child))
        })
        this._cursorElement.parentNode.insertBefore(node, this._cursorElement)
        node.appendChild(this._cursorElement.parentNode.removeChild(this._cursorElement))
        //console.log("node", node, "childNodes", childNodes)
        for (var i = 0; i < childNodes.length; i++) {
            //console.log("iterating over chiild", childNodes[i])
            await this._typeNodeContents(childNodes[i], settings)
            //console.log("finished iterating over chiild", childNodes[i])
        }
        // AFTER WE'VE ITERATED OVER ALL OF THIS NODES CHILDREN, WE NEED TO MOVE THE CURSOR TO THE RIGHT OF IT SO ITS READY FOR ITS NEXT USE
        if (node.nextSibling) {
            node.nextSibling.parentNode.insertBefore(this._cursorElement.parentNode.removeChild(this._cursorElement), node.nextSibling)
        }
        else {
            node.parentNode.appendChild(this._cursorElement.parentNode.removeChild(this._cursorElement))
        }
    }

    async move(keystrokes, options) { // remember that cursor position is always right adjacent to the last character entered, so after entering the first character, the cursor position is 1
        if (typeof keystrokes != "number") {
            throw new Error("Typist.move only accepts number values at position 1")
        }
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options) // create a copy of this._settings and merge options into it
        /* first, map current settings onto defaults to create a copy of current settings,
               then map parameter options onto the _settings copy */
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay) // wait for delay
        this._stopCursorBlink()
        // //console.log((i < Math.abs(Math.floor(keystrokes))) && ((this._cursorPosition >= 0 && keystrokes >= 0) || (this._cursorPosition <= this._characterEntries.length && keystrokes <= 0)))
        for (var i = 0; (i < Math.abs(Math.floor(keystrokes))) && ((this._cursorPosition >= 0) && (this._cursorPosition <= this._characterEntries.length)); i++) {
            if ((keystrokes > 0 && this._cursorPosition + 1 > this._characterEntries.length) || (keystrokes < 0 && this._cursorPosition - 1 < 0)) { // if the next move will take us out of bounds, dont do it
                return
            }
            this._clearBlinkStartTimeout()
            this._beginBlinkStartTimeout()
            this._cursorPosition += keystrokes > 0 ? 1 : -1
            var cursorParentNode = this._cursorElement.parentNode
            cursorParentNode.removeChild(this._cursorElement)
            //console.log(this._cursorPosition, this._characterEntries.length,  this._characterEntries[this._cursorPosition])
            if(this._characterEntries[this._cursorPosition]){
                var newParentNode = this._characterEntries[this._cursorPosition]?.parentNode
                newParentNode.insertBefore(this._cursorElement, this._characterEntries[this._cursorPosition])
                // //console.log("MOVED THE CURSOR")
            }
            else{
                this._fieldElement.appendChild(this._cursorElement)
            }
            await this.pause(typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval)
        }

        this._beginBlinkStartTimeout()
    }

    async moveToEnd(options) {
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options)
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay)
        this._stopCursorBlink()
        while (this._cursorPosition < this._characterEntries.length) { // if the cursor points to the character after the end of the field entries
            await this.move(1, {
                keystrokeDelay: 0, // pass in a zero so we don't accidentally use initialization settings
                keystrokeInterval: typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval
            }) // delete characters until 
        }
    }

    async moveToStart(options) {
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options)
        /* first, map current settings onto defaults to create a copy of current settings,
               then map parameter options onto the _settings copy */
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay)
        this._stopCursorBlink()
        while (this._cursorPosition > 0) {
            await this.move(-1, {
                keystrokeDelay: 0, // pass in a zero so we don't accidentally use initialization settings
                keystrokeInterval: typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval
            }) // delete characters until 
        }
    }

    async deleteAll(options) {
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options)
        /* first, map current settings onto defaults to create a copy of current settings,
               then map parameter options onto the _settings copy */
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay)
        this._stopCursorBlink()
        while (this._cursorPosition > 0) {
            this._clearBlinkStartTimeout()
            this._beginBlinkStartTimeout()
            await this.delete(1, {
                keystrokeDelay: 0, // pass in a zero so we don't accidentally use initialization settings
                keystrokeInterval: typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval
            }) // delete characters until 
        }
        this._beginBlinkStartTimeout()
        //console.log(this._cursorPosition)
    }

    async delete(keystrokes, options) {
        if (typeof keystrokes != "number") {
            throw new Error("Typist.type only accepts number arguments as first parameter")
        }
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options)
        /* first, map current settings onto defaults to create a copy of current settings,
               then map parameter options onto the _settings copy */
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay)
        this._stopCursorBlink()
        for (var i = 0;
            (i < Math.floor(keystrokes)) && (this._cursorPosition > 0); i++) {
            //this._fieldElement.removeChild(this._characterEntries[this._cursorPosition - 1])
            this._clearBlinkStartTimeout()
            this._beginBlinkStartTimeout()
            this._characterEntries[this._cursorPosition - 1].parentNode.removeChild(this._characterEntries[this._cursorPosition - 1]) // doing this enables on the fly swapping of field elements
            this._characterEntries.splice(this._cursorPosition - 1, 1)
            this._cursorPosition--
            await this.pause(typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval() : settings.keystrokeInterval)
        }
        this._beginBlinkStartTimeout()
    }

    async deleteUntilDelimiter(delimiter, options) {
        if(this.isFrozen()){throw new Error("Typist is frozen and cannot handle new inputs")}
        if (typeof delimiter != "string") {
            throw new Error("Typist.deleteUntilDelimiter only accepts string values at position 1")
        }
        var settings = Object.assign(Object.assign(Typist.defaultSettings(), this._settings), options)
        /* first, map current settings onto defaults to create a copy of current settings,
               then map parameter options onto the _settings copy */
        this._beginBlinkStartTimeout()
        await this.pause(settings.keystrokeDelay || this._settings.keystrokeDelay)
        this._stopCursorBlink()
        while (this._cursorPosition > 0 && this._characterEntries[this._cursorPosition - 1].nodeValue != delimiter) {
            ////console.log("node value is ", this._characterEntries[this._cursorPosition - 1].nodeValue)
            await this.delete(1, {
                keystrokeDelay: 0, // pass in a zero so we don't accidentally use initialization settings
                keystrokeInterval: typeof settings.keystrokeInterval == "function" ? settings.keystrokeInterval(this) : settings.keystrokeInterval
            }) // delete characters until delimiter is reached
        }
        this._beginBlinkStartTimeout()
        //console.log(this._cursorPosition)
    }
    freeze(){
        this._frozen = true
        this._clearBlinkStartTimeout()
        this._stopCursorBlink()
        this._cursorElement.parentNode.removeChild(this._cursorElement);
    }
    unfreeze(){
        this._frozen = false
        if(this._characterEntries[this._cursorPosition]){
            this._cursorElement.parentNode.insertBefore(this._cursorElement, this._characterEntries[this._cursorPosition]);
            
        }
        else{
            this._fieldElement.appendChild(this._cursorElement);
        }
        this._startCursorBlink();
    }
    isFrozen(){
        return this._frozen ? true : false;
    }
    clear(){
        var cursor = this._cursorElement
        cursor.parentNode.removeChild(cursor) // remove cursor from parent
        this._fieldElement.innerHTML = "" // remove all children
        this._fieldElement.appendChild(cursor) // reinsert the cursor
        this._characterEntries = []
        this._cursorPosition = 0
    }
}


export default Typist