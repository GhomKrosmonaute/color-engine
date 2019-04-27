# Color Engine *for colored projects*

Color engine for creates color gradients from a few colors and converts RBG colors to HEX and vice versa.

## Install

Go to your project directory with `cd` and then do this

```
npm install color-engine
```

## How to use ?

```js
const Color = require('color-engine')

const blue = new Color("0000FF")
const red = new Color([255,0,0])
const NaC = new Color("gneu")
// NaC : Not a color

blue.fusion(red,.5)
//=> Color (purple)

blue.toString()
//=> String (hex color)

blue.isColor
//=> Boolean (true)
NaC.isColor
//=> Boolean (false)

Color.gradient([blue,red],5)
/*=> Array (gradient) [
	Color (blue),
	Color (purple-blue),
	Color (purple),
	Color (purple-red),
	Color (red),
]*/

Color.hexToRgb(blue.hex)
//=> Array (rgb color) [0,0,255]
Color.rgbToHex(blue.rgb)
//=> String (hex color) "#0000FF"
```

## How to test ?

Go to the package directory with `cd` and then do this

```
npm test
```