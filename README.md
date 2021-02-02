

# Typerbot :robot:

What is Typerbot?

Typerbot is a flexible library designed to mimic keyboard input into any DOM Element. Built on `Async/Await` , Typerbot provides an intuitive  API to let developers focus on unleashing their creativity instead of getting lost in the weeds. 

####[Try Typerbot out here!](https://jsfiddle.net/cerdman13/rhfq4u6z/2/ "Try Typerbot out here!")

## Features

 - Typerbot can mimic any input from a keyboard, allowing users to move
   their cursor, delete characters, and enter new characters into a
   provided field element.
 - Use handy utility functions to expedite your development process and write code in a more declarative manner.
 - Create visually interesting effects by combining provided callbacks with CSS.
 

<h1>API</h1>

#### Installation

npm - `npm i typerbot`

CDN - `https://cdn.jsdelivr.net/npm/typerbot@latest/dist/typerbot.min.js`


------------

## Initialization

### Typerbot(fieldElement, [options])

**fieldElement**: `HTMLElement`, Element in which text will be entered.

**options**: `Object`,  settings used for given input. These will overwrite the default settings.

``` Javascript
	var settings = {} // put your settings here
	var myTyperBot = new TyperBot(Document.querySelector(".field-element"), settings) // default settings will be used if none are provided
```

### Default Options


| Property | Description | Type | Default Value |
| ------------ | ------------ | ------------ | ------------ |
| keystrokeInterval | controls the speed of inputs in Milliseconds | Number | 200 |
| keystrokeDelay | amount of time in milliseconds that Typerbot.move(), Typerbot.delete(), Typerbot.deleteUntilDelimiter(), Typerbot.moveToStart(), Typer.moveToEnd()  and Typerbot.deleteAll() will wait before executing  | Number | 0 |
| pauseDuration | amount of time in milliseconds that Typerbot.pause() will wait for | Number | 1000 |
| cursorBlinkInterval | amount of time in milliseconds between cursor blinks | Number | 800 |
| cursorClass | CSS class to be applied to the cursor element | String | "typerbot-cursor" |
| html | will HTML passed into Typerbot.type() be parsed as HTML or as plaintext | Boolean | Hello |
| cursor | controls whether the cursor is visible | Boolean | true |
| cursorString | character that appears as cursor | String |"&#124;" |
| afterLineComplete | callback that executes at the end of Typebot.type() | Function | `() => {}` |
| beforeLineComplete | callback that executes at the start of Typebot.type() | Function |  `() => {}` |
| beforeKeyInput |  callback that executes after Typerbot before a character is entered/deleted or the cursor is moved | Function |  `() => {}` |
| afterKeyInput | callback that executes after Typerbot after a character is entered/deleted or the cursor is moved | Function |  `() => {}` |

</br>
</br>

## Methods

</br>

### Typerbot.type(stringInput, [options]) : `Promise`

Insert characters into the field element.

- **stringInput**: `String`, string that will be entered into the field element.

- **options**: `Object`, settings used for given input. These will overwrite the default settings as well as settings provided in the constructor.


------------


### Typerbot.delete(numberOfCharactersToDelete, [options])  : `Promise`

Delete a specified number of characters from the field element with the cursor as the starting point.

- **numberOfCharactersToDelete**: `Number`, number of characters that will be deleted.

- **options**: `Object`, settings used for given input. These will overwrite the default settings as well as settings provided in the constructor.


------------


### Typerbot.deleteUntilDelimiter(delimiter, [options]) : `Promise`

Deletes characters until the provided delimiter is encountered.

- **delimiter**: `String`, Delimiter used to determine when to stop deleting characters.

- **options**: `Object`, settings used for given input. These will overwrite the default settings as well as settings provided in the constructor.

------------

### Typerbot.move(numberOfcharactersToMove, [options]) : `Promise`

Move the cursor a specified number of positions.

- **numberOfCharactersToMove**: `Number`, Element in which text will be entered

- **options**: `Object`, settings used for given input. These will overwrite the default settings as well as settings provided in the constructor.


------------


### Typerbot.moveToEnd([options]) : `Promise`

Moves cursor to the end of the field element.

- **options**: `Object`, settings used for given input. These will overwrite the default settings as well as settings provided in the constructor.


------------


### Typerbot.clear()

Clear all characters from fieldElement and resets Typerbot instance internal state.

------------


### Typerbot.freeze()

Hides cursor and prevents new inputs methods from being executed. 


------------


### Typerbot.unfreeze()

Reverses the effects of Typerbot.freeze().


------------


### Typerbot.isFrozen() : `Boolean`

Returns boolean indicating whether or not Typerbot instance is frozen. 


------------


