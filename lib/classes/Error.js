"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETError = void 0;
/**
 * ErisTube Error instance
 *
 * @private
 *
 * @class
 * @classdesc Custom error class.
 */
class ETError extends Error {
    name;
    /**
     * Constructs a new instance of ETError.
     *
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        /**
         * Name of the error.
         *
         * @type {string}
         */
        this.name = 'ErisTube Error';
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, ETError.prototype);
    }
}
exports.ETError = ETError;
