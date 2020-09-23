import * as utils from "./utils"

export type ColorResolvable = Rgb | Hex | Color | string
export type Rgb = [number, number, number]
/**
 * resolvable hex color
 */
export type Hex = string | number | HexCode
/**
 * hex color code (without prefix)
 */
export type HexCode = string
/**
 * resolvable color list
 */
export type GradientResolvable = ColorResolvable[]
/**
 * color list
 */
export type Gradient = Color[]

export const hexRegex = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
export const rgbRegex = /^\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*$/

export default class Color {
  /**
   * edit this flag to change default type of Hex values
   * (string or number)
   * default: number
   */
  static hexMode: "number" | "string" = "string"

  private r = 0
  private g = 0
  private b = 0
  private a = 255

  /**
   * Not a color ?
   */
  readonly isNaC: boolean

  get red(): number {
    return this.r
  }
  get green(): number {
    return this.g
  }
  get blue(): number {
    return this.b
  }
  get alpha(): number {
    return this.a
  }

  set red(r) {
    this.r = r
  }
  set green(g) {
    this.g = g
  }
  set blue(b) {
    this.b = b
  }
  set alpha(a) {
    this.a = a
  }

  constructor(resolvable: ColorResolvable) {
    const rgb = Color.resolve(resolvable)
    this.isNaC = !rgb
    if (rgb) {
      this.r = rgb[0]
      this.g = rgb[1]
      this.b = rgb[2]
    }
  }

  /**
   * get the RGB color as Array
   */
  get rgb(): Rgb {
    return [this.r, this.g, this.b]
  }

  /**
   * get the hex color as {Color.hexMode}
   */
  get hex(): string | number {
    return Color.rgbToHex(this.rgb)
  }

  /**
   * get the hex color as String
   */
  get hexString(): string {
    return Color.rgbToHexString(this.rgb)
  }

  /**
   * get the hex color as Number
   */
  get hexNumber(): number {
    return Color.rgbToHexNumber(this.rgb)
  }

  /**
   * get hex code (without prefix) as String
   */
  get hexCode(): string {
    return Color.rgbToHexCode(this.rgb)
  }

  /**
   * @param resolvable - the fusion color
   * @param proportion - the ratio of fusion with the second color (0...1)
   */
  fusion(resolvable: ColorResolvable, proportion: number): Color {
    const color = new Color(resolvable)
    return this.map((c, i) => {
      return utils.map(proportion, 0, 1, c, color.rgb[i])
    })
  }

  /**
   * return a new Color with mapped values [r, g, b]
   */
  map(callback: (value: number, index: number) => number): Color {
    return new Color(this.rgb.map(callback) as Rgb)
  }

  toString(type: "rgb" | "hex" = "hex"): string {
    switch (type) {
      case "hex":
        return Color.rgbToHexString(this.rgb)
      case "rgb":
        return this.rgb.toString()
    }
  }

  /**
   * alias for hexNumber
   */
  toNumber(): number {
    return Color.rgbToHexNumber(this.rgb)
  }

  toJSON(): Rgb {
    return this.rgb
  }

  /**
   * return false if the given resolvable is not a color
   * @param resolvable - color to resolve
   */
  static resolve(resolvable: ColorResolvable): Rgb | false {
    if (!resolvable) return false
    if (typeof resolvable === "number" || typeof resolvable === "string") {
      if (this.isRgb(resolvable)) {
        return Color.stringToRgb(resolvable as string) as Rgb
      } else if (this.isHex(resolvable)) {
        return Color.hexToRgb(resolvable) as Rgb
      }
    } else if (Array.isArray(resolvable)) {
      if (
        resolvable.length !== 3 ||
        resolvable.some((c) => {
          return isNaN(c) || c < 0 || c > 255
        })
      )
        return false
      return resolvable as Rgb
    } else if (!resolvable.isNaC) {
      return resolvable.rgb
    }
    return false
  }

  static rgbToHexCode(rgb: Rgb): HexCode {
    return ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
      .toString(16)
      .slice(1)
  }

  static hexCodeToHex(hexCode: HexCode): Hex {
    switch (this.hexMode) {
      case "string":
        return "#" + hexCode
      case "number":
        return Number("0x" + hexCode)
    }
  }

  static rgbToHex(rgb: Rgb): Hex {
    return this.hexCodeToHex(this.rgbToHexCode(rgb))
  }

  static rgbToHexString(rgb: Rgb): string {
    return "#" + this.rgbToHexCode(rgb)
  }

  static rgbToHexNumber(rgb: Rgb): number {
    return Number("0x" + this.rgbToHexCode(rgb))
  }

  static hexToRgb(hex: Hex): Rgb | null {
    const result = hexRegex.exec(String(hex))
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null
  }

  static stringToRgb(resolvable: string): Rgb | null {
    const result = rgbRegex.exec(resolvable)
    return result
      ? [Number(result[1]), Number(result[2]), Number(result[3])]
      : null
  }

  static isHex(resolvable: Hex): boolean {
    return hexRegex.test(String(resolvable))
  }

  static isRgb(resolvable: any): boolean {
    return rgbRegex.test(String(resolvable))
  }

  /**
   * return a gradiant from another mapped gradient
   * @param resolvable - input gradient
   * @param length - output gradient length
   */
  static gradient(resolvable: GradientResolvable, length: number): Gradient {
    const colors: Gradient = resolvable.map((r) => new Color(r))
    let array = []
    let section = length / (colors.length - 1)
    for (let i = 0; i < length; i++) {
      if (colors.length > 1) {
        let c = Math.floor(i / section)
        array.push(
          colors[c].fusion(
            colors[c + 1],
            utils.map(i - c * section, 0, section, 0, 1)
          )
        )
      } else if (colors.length > 0) {
        array.push(colors[0])
      }
    }
    return array
  }

  /**
   * return new random Color
   */
  static random(): Color {
    return new Color([
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ])
  }
}
