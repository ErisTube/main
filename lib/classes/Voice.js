"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETVoice = void 0;
// Import addons
const Error_1 = require("./Error");
/**
 * Manages voice connections for the bot.
 *
 * Handles the creation, management, and termination
 * of voice connections. It maintains a map of active connections and provides
 * utility methods to interact with voice channels.
 *
 * @class
 * @classdesc ErisTube voice manager
 */
class ETVoice {
    _client;
    _debug;
    /**
     * @constructor
     *
     * @param {Client} client - The bot client instance to use for managing voice connections.
     * @param {boolean} debug - Whether debug mode is enabled for logging and troubleshooting.
     */
    constructor(client, debug = false) {
        /**
         * Eris client
         *
         * @private
         * @type {Client}
         */
        this._client = client;
        /**
         * Debug mode
         *
         * @private
         * @type {boolean}
         */
        this._debug = debug;
    }
    /**
     * Checks if there is an active connection to a specified voice channel.
     *
     * Determines whether the client is currently connected to the voice channel with the given ID.
     * Returns `true` if a connection is active, otherwise returns `false`.
     *
     * @param {string} channelId - The ID of the voice channel to check.
     *
     * @returns {boolean} `true` if the client is connected to the specified channel, otherwise `false`.
     */
    isConnected(channelId) {
        const state = Boolean(this._client.voiceConnections.find(c => c.channelID === channelId));
        if (this._debug) {
            console.log(`[ErisTube Voice] Channel Id: ${channelId}, isConnected: ${state}`);
        }
        return state;
    }
    /**
     * Connects to a specified voice channel.
     *
     * Establishes a connection to a voice channel using the provided channel ID.
     * Returns an active `VoiceConnection` instance once the connection is established.
     *
     * @param {string} channelId - The ID of the voice channel to connect to.
     *
     * @returns {Promise<VoiceConnection>} A promise that resolves to a `VoiceConnection` instance.
     */
    async connect(channelId) {
        try {
            if (this._debug) {
                console.log(`[ErisTube Voice] Start connecting to voice channel with id: ${channelId}`);
            }
            const connection = await this._client.joinVoiceChannel(channelId, {
                selfDeaf: true,
                opusOnly: true,
            });
            if (this._debug) {
                console.log(`[ErisTube Voice] Connected to voice channel, Guild Id: ${connection.id} Channel Id: ${channelId}`);
            }
            return connection;
        }
        catch (e) {
            throw new Error_1.ETError(`Failed connect to voice channel with id '${channelId}'!`);
        }
    }
    /**
     * Disconnects from a specified voice channel.
     *
     * Terminates the active `VoiceConnection` associated with the provided channel ID.
     * If no active connection exists for the given channel, no action is taken.
     *
     * @param {string} channelId - The ID of the voice channel to disconnect from.
     *
     * @returns {VoiceConnection} The terminated `VoiceConnection` instance.
     */
    disconnect(channelId) {
        if (this._debug) {
            console.log(`[ErisTube Voice] Disconnecting from voice channel with id: ${channelId}`);
        }
        const connection = this._client.voiceConnections.find(c => c.channelID === channelId);
        if (!connection) {
            throw new Error_1.ETError(`Voice connection with id '${channelId}' not found!`);
        }
        this._client.leaveVoiceChannel(channelId);
        if (this._debug) {
            console.log(`[ErisTube Voice] Disconnected from voice channel, Guild Id: ${connection.id}, Channel Id: ${channelId}`);
        }
        return connection;
    }
}
exports.ETVoice = ETVoice;
