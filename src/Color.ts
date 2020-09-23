import * as utils from "./utils"

export type ColorResolvable = Rgb | Hex | Color | string
export type Rgb = [number, number, number]
export type Hex = string
export type GradientResolvable = ColorResolvable[]
export type Gradient = Color[]

export const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
export const rgbRegex = /^\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*$/

export default class Color {
  private r = 0
  private g = 0
  private b = 0
  private a = 255

  /**
   * Not a color ?
   */
  public readonly isNaC: boolean

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

  get rgb(): Rgb {
    return [this.r, this.g, this.b]
  }
  get hex(): string {
    return Color.rgbToHex(this.rgb)
  }

  fusion(resolvable: ColorResolvable, proportion: number): Color {
    const color = new Color(resolvable)
    return this.map((c, i) => {
      return utils.map(proportion, 0, 1, c, color.rgb[i])
    })
  }

  map(callback: (value: number, index: number) => number): Color {
    return new Color(this.rgb.map(callback) as Rgb)
  }

  toString(type: "rgb" | "hex" = "hex"): string {
    switch (type) {
      case "hex":
        return this.hex
      case "rgb":
        return this.rgb.toString()
    }
  }

  static resolve(resolvable: ColorResolvable): Rgb | false {
    if (!resolvable) return false
    if (typeof resolvable === "string") {
      if (this.isRgb(resolvable)) {
        return Color.stringToRgb(resolvable) as Rgb
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

  static rgbToHex(rgb: Rgb): Hex {
    return (
      "#" +
      ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
        .toString(16)
        .slice(1)
    )
  }

  static hexToRgb(hex: Hex): Rgb | null {
    const result = hexRegex.exec(hex)
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

  static isHex(resolvable: string): boolean {
    return hexRegex.test(resolvable)
  }

  static isRgb(resolvable: string): boolean {
    return rgbRegex.test(resolvable)
  }

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

  static random(): Color {
    return new Color([
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ])
  }
}
