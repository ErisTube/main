// Import requirements
import { Client, VoiceConnection } from 'eris';
import { ETError } from './Error';

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
export class ETVoice {
	private _client: Client;

	/**
	 * @constructor
	 *
	 * @param {Client} client - The bot client instance to use for managing voice connections.
	 */
	constructor(client: Client) {
		/**
		 * Eris client
		 *
		 * @private
		 * @type {Client}
		 */
		this._client = client;
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
	public isConnected(channelId: string): boolean {
		return Boolean(
			this._client.voiceConnections.find(c => c.channelID === channelId)
		);
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
	public async connect(channelId: string): Promise<VoiceConnection> {
		try {
			const connection = await this._client.joinVoiceChannel(channelId, {
				selfDeaf: true,
				opusOnly: true,
			});

			return connection;
		} catch (e) {
			throw new ETError(
				`Failed connect to voice channel with id '${channelId}'!`
			);
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
	public disconnect(channelId: string): VoiceConnection {
		const connection = this._client.voiceConnections.find(
			c => c.channelID === channelId
		);

		if (!connection) {
			throw new ETError(`Voice connection with id '${channelId}' not found!`);
		}

		this._client.leaveVoiceChannel(channelId);

		return connection;
	}
}
