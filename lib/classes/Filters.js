"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETFilters = void 0;
// Import utils
const normalizeArray_function_1 = require("../util/normalizeArray.function");
/**
 * A class that provides various filters for ErisTube queues.
 *
 * @class
 * @classdesc ErisTube filters manager
 */
class ETFilters {
    _data;
    _debug;
    constructor(debug = false) {
        /**
         * Filters storage
         *
         * @private
         * @type {PlaybackFilter[]}
         */
        this._data = [
            { name: '3D', value: 'apulsator=hz=0.125' },
            { name: 'bassboost', value: 'bass=g=10,dynaudnorm=f=150:g=15' },
            { name: 'echo', value: 'aecho=0.8:0.9:1000:0.3' },
            { name: 'fadein', value: 'afade=t=in:ss=0:d=10' },
            { name: 'flanger', value: 'flanger' },
            { name: 'gate', value: 'agate' },
            { name: 'haas', value: 'haas' },
            { name: 'karaoke', value: 'stereotools=mlev=0.1' },
            {
                name: 'nightcore',
                value: 'asetrate=48000*1.25,aresample=48000,bass=g=5',
            },
            { name: 'reverse', value: 'areverse' },
            {
                name: 'vaporwave',
                value: 'asetrate=48000*0.8,aresample=48000,atempo=1.1',
            },
            { name: 'mcompand', value: 'mcompand' },
            { name: 'phaser', value: 'aphaser' },
            { name: 'tremolo', value: 'tremolo' },
            { name: 'surround', value: 'surround' },
            { name: 'slowed', value: 'asetrate=25000*1.25,aresample=50000,bass=g=2' },
            { name: 'earwax', value: 'earwax' },
            { name: 'underwater', value: 'aresample=5000' },
            { name: 'clear', value: 'anull' },
        ];
        /**
         * Debug mode
         *
         * @private
         * @type {boolean}
         */
        this._debug = debug;
    }
    /**
     * Registers new audio filters.
     *
     * @param {...RestOrArray<PlaybackFilter>} data - One or more `PlaybackFilter` objects or arrays of `PlaybackFilter` objects.
     *
     * @returns {PlaybackFilter[]} The updated list of registered filters.
     */
    register(...data) {
        const filters = (0, normalizeArray_function_1.normalizeArray)(data);
        for (const filter of filters) {
            this._data.push({
                name: filter.name,
                value: filter.value,
            });
            if (this._debug) {
                console.log(`[ErisTube Filters] Filter '${filter.name}' successfully registered!`);
            }
        }
        return this._data;
    }
    /**
     * Retrieves a registered filter by its name.
     *
     * @param {string} name - The name of the filter to retrieve.
     *
     * @returns {PlaybackFilter} The found filter, or `null` if no filter matches the given name.
     */
    get(name) {
        const filter = this._data.find(f => f.name === name);
        if (this._debug) {
            console.log(`[ErisTube Filters] Filter: ${name}, registered: ${Boolean(filter)}`);
        }
        return filter ?? null;
    }
    /**
     * Unregister one or more filters by name.
     *
     * @param {...string[]} data - One or more filter names to remove.
     *
     * @returns {PlaybackFilter[]} The updated list of registered filters.
     */
    unregister(...data) {
        const filters = (0, normalizeArray_function_1.normalizeArray)(data);
        for (const filter of filters) {
            this._data = this._data.filter(f => f.name != filter);
            if (this._debug) {
                console.log(`[ErisTube Filters] Filter '${filter}' successfully unregistered!`);
            }
        }
        return this._data;
    }
    /**
     * Retrieves all registered filters.
     *
     * @returns {PlaybackFilter[]} The list of all registered filters.
     */
    all() {
        if (this._debug) {
            console.log(`[ErisTube Filters] Received ${this._data.length} filters!`);
        }
        return this._data;
    }
}
exports.ETFilters = ETFilters;
