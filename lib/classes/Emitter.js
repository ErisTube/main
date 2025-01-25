"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETEmitter = void 0;
// Import requirements
const events_1 = require("events");
/**
 * ErisTube event emitter.
 *
 * @private
 *
 * @class
 * @classdesc Represents an event emitter for events.
 */
class ETEmitter {
    _emitter = new events_1.EventEmitter();
    /**
     * Registers an event listener for the specified event.
     *
     * @param {ErisPlayerEvents} event - The event to listen for.
     * @param {Function} listener - The listener function to be called when the event occurs.
     *
     * @returns {ETEmitter} The current ETEmitter instance for method chaining.
     */
    on(event, listener) {
        this._emitter.on(event, listener);
        return this;
    }
    /**
     * Registers a one-time event listener for the specified event.
     * The listener will be automatically removed after being called once.
     *
     * @param {ErisPlayerEvents} event - The event to listen for.
     * @param {Function} listener - The listener function to be called when the event occurs.
     *
     * @returns {ETEmitter} The current ETEmitter instance for method chaining.
     */
    once(event, listener) {
        this._emitter.once(event, listener);
        return this;
    }
    /**
     * Emits the specified event and passes all parameters to the listener.
     *
     * @param {ErisPlayerEvents} event - The event to emit.
     * @param {any} args - The arguments to pass to the listeners.
     *
     * @returns {boolean} A flag indicating whether the event had listeners or not.
     */
    emit(event, ...args) {
        return this._emitter.emit(event, ...args);
    }
}
exports.ETEmitter = ETEmitter;
