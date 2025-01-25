"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETPlugin = void 0;
/**
 * @abstract
 *
 * @class
 * @classdesc ErisTube plugin abstract class
 */
class ETPlugin {
    /**
     * Initializes the ErisTube instance.
     *
     * @param {ErisTube} e - The ErisTube instance to initialize.
     *
     * @returns {ETPlugin} Updated instance.
     */
    init(e) {
        this.eristube = e;
        return this;
    }
}
exports.ETPlugin = ETPlugin;
