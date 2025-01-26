"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = formatNumber;
/**
 * Format a number as a string with a leading zero if it's between 0 and 9 (inclusive).
 *
 * @callback formatNumber
 *
 * @param {number} value - The number to format.
 *
 * @returns {string} The formatted number as a string.
 */
function formatNumber(value) {
    return value >= 0 && value <= 9 ? `0${value}` : value.toString();
}
