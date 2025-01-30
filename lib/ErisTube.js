"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErisTube = void 0;
// Import addons
const Error_1 = require("./classes/Error");
const Voice_1 = require("./classes/Voice");
const Emitter_1 = require("./classes/Emitter");
const Filters_1 = require("./classes/Filters");
const Enums_1 = require("./Enums");
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
    queues;
    voice;
    filters;
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
         * ErisTube queues map
         *
         * @type {Map<string, ETGuildQueue>}
         */
        this.queues = new Map();
        /**
         * ErisTube voice manager
         *
         * @type {ETVoice}
         */
        this.voice = new Voice_1.ETVoice(this._client, this.options.debug);
        /**
         * ErisTube filters manager
         *
         * @type {ETFilters}
         */
        this.filters = new Filters_1.ETFilters(this.options.debug);
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
     * Searches for tracks or playlists based on the given query.
     *
     * @param {string} query - The search query (e.g., song name, artist, or playlist title).
     * @param {SearchType} [type='track'] - The type of search (`'track'` or `'playlist'`). Defaults to `'track'`.
     * @param {number} [count=null] - The maximum number of results to return. If `null`, returns all available results.
     *
     * @returns {Promise<SearchTrackData | SearchTrackData[] | SearchPlaylist[]>} Resolves to either a single track, an array of tracks, or an array of playlists.
     */
    async search(query, type = 'track', count = null) {
        try {
            const plugins = this.plugins
                .values()
                .toArray()
                .filter(p => p.type === Enums_1.ETPluginType.SEARCH);
            if (!plugins.length) {
                throw new Error_1.ETError('Could not find the required search provider. Try installing @eristube/youtube.');
            }
            if (this.options.debug) {
                console.log(`[ErisTube] Found ${plugins.length} plugins for searching tracks!`);
            }
            let results = undefined;
            for (const plugin of plugins) {
                results = await plugin.resolve(type, query, count ?? this.options.settings.searchResultsCount);
                if (typeof results != 'undefined') {
                    break;
                }
            }
            return results;
        }
        catch (e) {
            throw new Error_1.ETError(e.message);
        }
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
        if (this.options.debug) {
            console.log(`[ErisTube] Starting load plugins...`);
        }
        for (const plugin of plugins) {
            if (registered.has(plugin.name)) {
                throw new Error_1.ETError(`Plugin '${plugin.name}' already registered!`);
            }
            registered.set(plugin.name, plugin);
            if (this.options.debug) {
                console.log(`[ErisTube] Plugin '${plugin.name}@${plugin.version}' successfully loaded!`);
            }
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
            options.debug = false;
        if (!Array.isArray(options?.plugins))
            options.plugins = [];
        if (typeof options?.settings != 'object') {
            options.settings = {
                defaultVolume: 10,
                searchResultsCount: 10,
            };
        }
        else {
            if (typeof options?.settings?.defaultVolume != 'number')
                options.settings.defaultVolume = 10;
            if (typeof options?.settings?.searchResultsCount != 'number')
                options.settings.searchResultsCount = 10;
        }
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
