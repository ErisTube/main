"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErisTube = void 0;
// Import addons
const Error_1 = require("./classes/Error");
const Voice_1 = require("./classes/Voice");
const Emitter_1 = require("./classes/Emitter");
/**
 * ErisTube class.
 *
 * @class
 * @classdesc ErisTube main class.
 *
 * @extends {ETEmitter<ETEvents>}
 */
class ErisTube extends Emitter_1.ETEmitter {
    _client;
    _errored;
    options;
    plugins;
    voice;
    /**
     * @constructor
     *
     * @param {Client} client - Eris client instance.
     * @param {ETOptions} [options={}] - The configuration options for ErisTube.
     */
    constructor(client, options = {}) {
        super();
        /**
         * Eris client
         *
         * @private
         * @type {Client}
         */
        this._client = client;
        /**
         * Indicates whether an error has occurred
         *
         * @private
         * @type {boolean}
         */
        this._errored = false;
        /**
         * ErisTube options
         *
         * @type {ETOptions}
         */
        this.options = this.#initConfiguration(options);
        /**
         * ErisTube plugins list
         *
         * @type {Map<string, ETPlugin>}
         */
        this.plugins = this.#registerPlugins(options.plugins);
        /**
         * ErisTube voice manager
         *
         * @type {ETVoice}
         */
        this.voice = new Voice_1.ETVoice(this._client);
        this.#init();
    }
    /**
     * Indicates whether the ErisTube is ready.
     *
     * @returns {boolean} `True` if the ErisTube is ready, otherwise `false`.
     */
    get isReady() {
        return !this._errored;
    }
    /**
     * Registers an array of plugins and ensures there are no duplicates.
     *
     * @private
     *
     * @param {ETPlugin[]} plugins - An array of plugins to register.
     *
     * @returns {Map<string, ETPlugin>} A map containing the registered plugins, where the key is the plugin name.
     */
    #registerPlugins(plugins) {
        const registered = new Map();
        for (const plugin of plugins) {
            if (registered.has(plugin.name)) {
                throw new Error_1.ETError(`Plugin '${plugin.name}' already registered!`);
            }
            registered.set(plugin.name, plugin);
        }
        return registered;
    }
    /**
     * Initializes and configures the module with the provided options.
     *
     * @private
     *
     * @param {ETOptions} options - The configuration options to initialize.
     *
     * @returns {ETOptions} The processed and validated configuration options.
     */
    #initConfiguration(options) {
        if (typeof options?.debug != 'boolean')
            options.debug = true;
        if (!Array.isArray(options?.plugins))
            options.plugins = [];
        return options;
    }
    /**
     * Initializes the ErisTube instance.
     * Sets up necessary configurations and event listeners.
     *
     * @private
     *
     * @returns {void}
     */
    #init() {
        const interval = setInterval(() => {
            if (this._client.ready) {
                clearInterval(interval);
                this.emit('ready', this);
            }
        }, 100);
    }
}
exports.ErisTube = ErisTube;
