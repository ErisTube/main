"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeArray = normalizeArray;
/**
 * Normalize an array or a rest parameter array to a standard array.
 * If the input is already an array, it returns the input array as is.
 * If the input is a rest parameter array, it returns the first element of the array.
 *
 * @callback normalizeArray
 *
 * @template T - The type of the array elements.
 *
 * @param {RestOrArray<T>} arr - The input array or rest parameter array.
 *
 * @returns {T[]} The normalized array.
 */
function normalizeArray(arr) {
    if (Array.isArray(arr[0]))
        return arr[0];
    return arr;
}
/**
 * Represents data that may be an array or came from a rest parameter.
 *
 * @typedef {T[]} RestOrArray
 */
