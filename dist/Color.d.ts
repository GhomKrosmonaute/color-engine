export declare type ColorResolvable = Rgb | Hex | Color | string;
export declare type Rgb = [number, number, number];
export declare type Hex = string;
export declare type GradientResolvable = ColorResolvable[];
export declare type Gradient = Color[];
export declare const hexRegex: RegExp;
export declare const rgbRegex: RegExp;
export default class Color {
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
    get rgb(): Rgb;
    get hex(): string;
    fusion(resolvable: ColorResolvable, proportion: number): Color;
    map(callback: (value: number, index: number) => number): Color;
    toString(type?: "rgb" | "hex"): string;
    static resolve(resolvable: ColorResolvable): Rgb | false;
    static rgbToHex(rgb: Rgb): Hex;
    static hexToRgb(hex: Hex): Rgb | null;
    static stringToRgb(resolvable: string): Rgb | null;
    static isHex(resolvable: string): boolean;
    static isRgb(resolvable: string): boolean;
    static gradient(resolvable: GradientResolvable, length: number): Gradient;
    static random(): Color;
}
