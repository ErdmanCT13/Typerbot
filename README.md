# Typerbot

What is Typerbot?

Typerbot is a flexible library designed to mimic keyboard input into any DOM Element. Built on `Async/Await` , Typerbot provides an intuitive  API to let developers focus on unleashing their creativity instead of getting lost in the weeds. 

## Features

 - Typerbot can mimic any input from a keyboard, allowing users to move
   their cursor, delete characters, and enter new characters into a
   provided field element.
 - Use handy utility functions to expedite your development process and write code in a more declarative manner.
 - Create visually interesting effects by combining provided callbacks with CSS.

#API

#### Installation

npm - `npm i typerbot`

CDN - `https://cdn.jsdelivr.net/npm/typerbot@latest/typerbot.min.js`


------------

#### Initialization

###### Typerbot(fieldElement, [options])

##### Parameters

fieldElement: `HTMLElement`, Element in which text will be entered

options: `Object`

``` Javascript
	var settings = {} // put your settings here
	var myTyperBot = new TyperBot(Document.querySelector(".field-element"), settings) // default settings will be 
```

#### Default Options


| Property | Description | Type | Default Value |
| ------------ | ------------ | ------------ | ------------ |
| keystrokeInterval | controls the speed of inputs in Milliseconds | Number | 200 | 
| keystrokeDelay | amount of time in milliseconds that Typerbot.move(), Typerbot.delete(), Typerbot.deleteUntilDelimiter(), Typerbot.moveToStart(), Typer.moveToEnd()  and Typerbot.deleteAll() will wait before executing  | Number | 0 |
| pauseDuration | amount of time in milliseconds that Typerbot.pause() will wait for | Number | 1000 |
| cursorBlinkInterval | amount of time in milliseconds between cursor blinks | Number | 800 |
| cursorClass | CSS class to be applied to the cursor element | String | "typist-cursor" |
| html | will HTML passed into Typerbot.type() be parsed as HTML or as plaintext | Boolean | Hello |
| cursor | controls whether the cursor is visible | Boolean | Hello |
| cursorString | character that appears as cursor | String | Hello |
| afterLineComplete | callback that executes at the end of Typebot.type() | Function | `() => {}` |
| beforeLineComplete | callback that executes at the start of Typebot.type() | Function |  `() => {}` |
| beforeKeyInput |  callback that executes after Typerbot before a character is entered/deleted or the cursor is moved | Function |  `() => {}` |
| afterKeyInput | callback that executes after Typerbot after a character is entered/deleted or the cursor is moved | Function |  `() => {}` |

</br>

------------

</br>

#### Methods

</br>

##### Typerbot.type(stringInput, [options])

##### Parameters

fieldElement: `HTMLElement`, Element in which text will be entered

options: `Object`


------------



##### Typerbot.delete(numberOfCharactersToDelete, [options])

##### Parameters

fieldElement: `HTMLElement`, Element in which text will be entered

options: `Object`


------------



##### Typerbot.deleteUntilDelimiter(delimiter, [options])

##### Parameters

fieldElement: `HTMLElement`, Element in which text will be entered

options: `Object`


------------



##### Typerbot.move(numberOfcharactersToMove, [options])

##### Parameters

numberOfCharactersToMove: `Number`, Element in which text will be entered

options: `Object`


------------



##### Typerbot.moveToEnd([options])

##### Parameters

fieldElement: `HTMLElement`, Element in which text will be entered

options: `Object`


------------



##### Typerbot.moveToStart([options])

##### Parameters

options: `Object`






