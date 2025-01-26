"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidURL = isValidURL;
/**
 * Checks whether a given string is a valid URL.
 *
 * This function uses a regular expression to validate whether the input string
 * matches the general pattern of a URL, including optional protocols (http/https),
 * domain names, and optional query parameters or paths.
 *
 * @param {string} text - The string to validate as a URL.
 *
 * @returns {boolean} Returns `true` if the string is a valid URL, otherwise `false`.
 */
function isValidURL(text) {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return urlPattern.test(text);
}
