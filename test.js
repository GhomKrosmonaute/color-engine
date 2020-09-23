const Color = require("./dist/index")

const blue = new Color("0000FF")
const red = new Color([255, 0, 0])
const NaC = new Color("gneu")

test("[color] fusion between blue and red returns purple ?", () => {
  expect(blue.fusion(red, 0.5).rgb).toEqual([127.5, 0, 127.5])
})

test("[color] toString() method is called automatically ?", () => {
  expect(`${blue}`).toBe(blue.hex)
})

test("[color] blue is correct color ?", () => {
  expect(blue.isNaC).toBe(false)
})

test("[color] NaC is incorrect color ?", () => {
  expect(NaC.isNaC).toBe(true)
})

test("[gradient] has a correct size ?", () => {
  expect(Color.gradient([blue, red], 10).length).toBe(10)
})

test("[resolve] hex ?", () => {
  expect(Color.resolve(blue.hex)).toEqual(blue.rgb)
})

test("[resolve] rgb ?", () => {
  expect(Color.resolve(blue.rgb)).toEqual(blue.rgb)
})

test("[resolve] color ?", () => {
  expect(Color.resolve(blue)).toEqual(blue.rgb)
})

test("[resolve] NaC ?", () => {
  expect(Color.resolve(NaC)).toBe(false)
})

test("[convert] rgb to hex ?", () => {
  expect(Color.rgbToHex(blue.rgb)).toBe(blue.hex)
})

test("[convert] hex to rgb ?", () => {
  expect(Color.hexToRgb(blue.hex)).toEqual(blue.rgb)
})
