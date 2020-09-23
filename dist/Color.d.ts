export declare type ColorResolvable = Rgb | Hex | Color | string;
export declare type Rgb = [number, number, number];
/**
 * resolvable hex color
 */
export declare type Hex = string | number | HexCode;
/**
 * hex color code (without prefix)
 */
export declare type HexCode = string;
/**
 * resolvable color list
 */
export declare type GradientResolvable = ColorResolvable[];
/**
 * color list
 */
export declare type Gradient = Color[];
export declare const hexRegex: RegExp;
export declare const rgbRegex: RegExp;
export default class Color {
    /**
     * edit this flag to change default type of Hex values
     * (string or number)
     * default: number
     */
    static hexMode: "number" | "string";
    private r;
    private g;
    private b;
    private a;
    /**
     * Not a color ?
     */
    readonly isNaC: boolean;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    set red(r: number);
    set green(g: number);
    set blue(b: number);
    set alpha(a: number);
    constructor(resolvable: ColorResolvable);
    /**
     * get the RGB color as Array
     */
    get rgb(): Rgb;
    /**
     * get the hex color as {Color.hexMode}
     */
    get hex(): string | number;
    /**
     * get the hex color as String
     */
    get hexString(): string;
    /**
     * get the hex color as Number
     */
    get hexNumber(): number;
    /**
     * get hex code (without prefix) as String
     */
    get hexCode(): string;
    /**
     * @param resolvable - the fusion color
     * @param proportion - the ratio of fusion with the second color (0...1)
     */
    fusion(resolvable: ColorResolvable, proportion: number): Color;
    /**
     * return a new Color with mapped values [r, g, b]
     */
    map(callback: (value: number, index: number) => number): Color;
    toString(type?: "rgb" | "hex"): string;
    /**
     * alias for hexNumber
     */
    toNumber(): number;
    toJSON(): Rgb;
    /**
     * return false if the given resolvable is not a color
     * @param resolvable - color to resolve
     */
    static resolve(resolvable: ColorResolvable): Rgb | false;
    static rgbToHexCode(rgb: Rgb): HexCode;
    static hexCodeToHex(hexCode: HexCode): Hex;
    static rgbToHex(rgb: Rgb): Hex;
    static rgbToHexString(rgb: Rgb): string;
    static rgbToHexNumber(rgb: Rgb): number;
    static hexToRgb(hex: Hex): Rgb | null;
    static stringToRgb(resolvable: string): Rgb | null;
    static isHex(resolvable: Hex): boolean;
    static isRgb(resolvable: any): boolean;
    /**
     * return a gradiant from another mapped gradient
     * @param resolvable - input gradient
     * @param length - output gradient length
     */
    static gradient(resolvable: GradientResolvable, length: number): Gradient;
    /**
     * return new random Color
     */
    static random(): Color;
}
