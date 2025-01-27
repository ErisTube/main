import { Client, VoiceConnection } from 'eris';

export declare class ETVoice {
	constructor(client: Client, debug?: boolean);

	/**
	 * Checks if there is an active connection to a specified voice channel.
	 *
	 * Determines whether the client is currently connected to the voice channel with the given ID.
	 * Returns `true` if a connection is active, otherwise returns `false`.
	 *
	 * @param channelId - The ID of the voice channel to check.
	 *
	 * @returns `true` if the client is connected to the specified channel, otherwise `false`.
	 */
	public isConnected(channelId: string): boolean;

	/**
	 * Connects to a specified voice channel.
	 *
	 * Establishes a connection to a voice channel using the provided channel ID.
	 * Returns an active `VoiceConnection` instance once the connection is established.
	 *
	 * @param channelId - The ID of the voice channel to connect to.
	 *
	 * @returns A promise that resolves to a `VoiceConnection` instance.
	 */
	public connect(channelId: string): Promise<VoiceConnection>;

	/**
	 * Disconnects from a specified voice channel.
	 *
	 * Terminates the active `VoiceConnection` associated with the provided channel ID.
	 * If no active connection exists for the given channel, no action is taken.
	 *
	 * @param channelId - The ID of the voice channel to disconnect from.
	 *
	 * @returns The terminated `VoiceConnection` instance.
	 */
	public disconnect(channelId: string): VoiceConnection;
}
