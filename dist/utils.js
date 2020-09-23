"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constrain = exports.map = void 0;
function map(n, start1, stop1, start2, stop2, withinBounds = false) {
    const output = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds)
        return output;
    return start2 < stop2
        ? constrain(output, start2, stop2)
        : constrain(output, stop2, start2);
}
exports.map = map;
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}
exports.constrain = constrain;
