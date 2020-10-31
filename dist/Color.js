"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = exports.rgbRegex = exports.hexRegex = void 0;
const utils = __importStar(require("./utils"));
exports.hexRegex = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
exports.rgbRegex = /^\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*,\s*([1-9][0-9.]*)\s*$/;
class Color {
    constructor(resolvable) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 255;
        const rgb = Color.resolve(resolvable);
        this.isNaC = !rgb;
        if (rgb) {
            this.r = rgb[0];
            this.g = rgb[1];
            this.b = rgb[2];
        }
    }
    get red() {
        return this.r;
    }
    get green() {
        return this.g;
    }
    get blue() {
        return this.b;
    }
    get alpha() {
        return this.a;
    }
    set red(r) {
        this.r = r;
    }
    set green(g) {
        this.g = g;
    }
    set blue(b) {
        this.b = b;
    }
    set alpha(a) {
        this.a = a;
    }
    /**
     * get the RGB color as Array
     */
    get rgb() {
        return [this.r, this.g, this.b];
    }
    /**
     * get the hex color as {Color.hexMode}
     */
    get hex() {
        return Color.rgbToHex(this.rgb);
    }
    /**
     * get the hex color as String
     */
    get hexString() {
        return Color.rgbToHexString(this.rgb);
    }
    /**
     * get the hex color as Number
     */
    get hexNumber() {
        return Color.rgbToHexNumber(this.rgb);
    }
    /**
     * get hex code (without prefix) as String
     */
    get hexCode() {
        return Color.rgbToHexCode(this.rgb);
    }
    /**
     * @param resolvable - the fusion color
     * @param proportion - the ratio of fusion with the second color (0...1)
     */
    fusion(resolvable, proportion) {
        const color = new Color(resolvable);
        return this.map((c, i) => {
            return utils.map(proportion, 0, 1, c, color.rgb[i]);
        });
    }
    /**
     * return a new Color with mapped values [r, g, b]
     */
    map(callback) {
        return new Color(this.rgb.map(callback));
    }
    toString(type = "hex") {
        switch (type) {
            case "hex":
                return Color.rgbToHexString(this.rgb);
            case "rgb":
                return this.rgb.toString();
        }
    }
    /**
     * alias for hexNumber
     */
    toNumber() {
        return Color.rgbToHexNumber(this.rgb);
    }
    toJSON() {
        return this.rgb;
    }
    /**
     * return false if the given resolvable is not a color
     * @param resolvable - color to resolve
     */
    static resolve(resolvable) {
        if (!resolvable)
            return false;
        if (typeof resolvable === "number" || typeof resolvable === "string") {
            if (this.isRgb(resolvable)) {
                return Color.stringToRgb(resolvable);
            }
            else if (this.isHex(resolvable)) {
                return Color.hexToRgb(resolvable);
            }
        }
        else if (Array.isArray(resolvable)) {
            if (resolvable.length !== 3 ||
                resolvable.some((c) => {
                    return isNaN(c) || c < 0 || c > 255;
                }))
                return false;
            return resolvable;
        }
        else if (!resolvable.isNaC) {
            return resolvable.rgb;
        }
        return false;
    }
    static rgbToHexCode(rgb) {
        return ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
            .toString(16)
            .slice(1);
    }
    static hexCodeToHex(hexCode) {
        switch (this.hexMode) {
            case "string":
                return "#" + hexCode;
            case "number":
                return Number("0x" + hexCode);
        }
    }
    static rgbToHex(rgb) {
        return this.hexCodeToHex(this.rgbToHexCode(rgb));
    }
    static rgbToHexString(rgb) {
        return "#" + this.rgbToHexCode(rgb);
    }
    static rgbToHexNumber(rgb) {
        return Number("0x" + this.rgbToHexCode(rgb));
    }
    static hexToRgb(hex) {
        const result = exports.hexRegex.exec(String(hex));
        return result
            ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
            ]
            : null;
    }
    static stringToRgb(resolvable) {
        const result = exports.rgbRegex.exec(resolvable);
        return result
            ? [Number(result[1]), Number(result[2]), Number(result[3])]
            : null;
    }
    static isHex(resolvable) {
        return exports.hexRegex.test(String(resolvable));
    }
    static isRgb(resolvable) {
        return exports.rgbRegex.test(String(resolvable));
    }
    /**
     * return a gradiant from another mapped gradient
     * @param resolvable - input gradient
     * @param length - output gradient length
     */
    static gradient(resolvable, length) {
        const colors = resolvable.map((r) => new Color(r));
        let array = [];
        let section = length / (colors.length - 1);
        for (let i = 0; i < length; i++) {
            if (colors.length > 1) {
                let c = Math.floor(i / section);
                array.push(colors[c].fusion(colors[c + 1], utils.map(i - c * section, 0, section, 0, 1)));
            }
            else if (colors.length > 0) {
                array.push(colors[0]);
            }
        }
        return array;
    }
    /**
     * return new random Color
     */
    static random() {
        return new Color([
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ]);
    }
}
exports.Color = Color;
/**
 * edit this flag to change default type of Hex values
 * (string or number)
 * default: number
 */
Color.hexMode = "string";
