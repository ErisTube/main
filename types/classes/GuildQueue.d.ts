import { Readable } from 'stream';
import { VoiceConnection } from 'eris';
import {
	ErisTube,
	ETStream,
	GuildQueue,
	QueueOptions,
	QueueRepeat,
	QueueState,
	QueueTrack,
	RestOrArray,
	SearchTrackData,
	SkipType,
	TrackProgress,
} from '../index';

export declare class ETGuildQueue<T extends Record<string, any>> {
	constructor(eristube: ErisTube, options: QueueOptions);

	private _eristube: ErisTube;
	private _stream: ETStream;
	private _output: Readable;

	private _seek: number;
	private _trackIndex: number;
	private _autoplay: SearchTrackData[];

	public startedAt: number;
	public endedAt: number;

	public readonly guildId: string;
	public readonly textChannelId: string;
	public connection: VoiceConnection;
	public volume: number;
	public filter: string;
	public state: QueueState;
	public repeat: QueueRepeat;

	public tracks: QueueTrack[];
	public history: QueueTrack[];

	public custom: T;

	/**
	 * Number of tracks in current queue.
	 *
	 * @returns The total count of tracks.
	 */
	public get size(): number;

	/**
	 * Checks if the queue is empty.
	 *
	 * @returns `True` if the queue is empty, `false` otherwise.
	 */
	public get isEmpty(): boolean;

	/**
	 * Retrieves the currently playing track from the queue.
	 *
	 * @returns The currently playing track.
	 */
	public get nowPlaying(): QueueTrack;

	/**
	 * Retrieves the index of the currently playing track in the queue.
	 *
	 * @returns The index of the currently playing track.
	 */
	public get currentTrackId(): number;

	/**
	 * Adds tracks to the guild queue.
	 *
	 * @param userId - Discord user id.
	 * @param tracks - The tracks to add. Accepts both array and variadic arguments.
	 *
	 * @returns Updated instance.
	 */
	public addTracks(
		userId: string,
		...tracks: RestOrArray<SearchTrackData>
	): ETGuildQueue;

	/**
	 * Applies audio filters to the current FFmpeg stream.
	 *
	 * @param values - A list of FFmpeg audio filters, such as `"volume=1.5"` or `"atempo=1.2"`.
	 *                               If no filters are provided, the default `anull` filter is applied.
	 * @returns Updated instance.
	 */
	public setFilter(...values: string[]): ETGuildQueue;

	/**
	 * Sets the playback volume for the current stream and restarts playback.
	 *
	 * @param value - The desired volume level as a percentage (0 to 100 or higher).
	 * If not provided, the default volume from the player configuration will be used.
	 *
	 * @returns Updated instance.
	 */
	public setVolume(value?: number): ETGuildQueue;

	/**
	 * Sets the playback state of the queue.
	 *
	 * @param value - The new state of the queue. Defaults to `QueueState.PLAYING`.
	 *
	 * @returns Updated instance.
	 */
	public setState(value?: QueueState): ETGuildQueue;

	/**
	 * Sets the repeat mode for the queue.
	 *
	 * @param value - The repeat mode to set. Defaults to `QueueRepeat.TRACK`.
	 *
	 * @returns Updated instance.
	 */
	public setRepeat(value?: QueueRepeat): ETGuildQueue;

	/**
	 * Sets a custom value in the queue's custom properties.
	 *
	 * @param key - The key of the custom property to set.
	 * @param value - The value to assign to the specified key.
	 *
	 * @returns Updated instance.
	 */
	public setCustomValue<K extends keyof T>(key: K, value: T[K]): ETGuildQueue;

	/**
	 * Retrieves a custom value from the queue's custom properties.
	 *
	 * @param key - The key of the custom property to retrieve.
	 *
	 * @returns The value associated with the specified key.
	 */
	public getCustomValue<K extends keyof T>(key: K): T[K];

	/**
	 * Skips the currently playing track in the queue.
	 *
	 * @param value - The direction to skip. Defaults to `SkipType.NEXT`.
	 * Use `SkipType.NEXT` to skip to the next track, or `SkipType.PREVIOUS` to go back to the previous track.
	 *
	 * @returns Updated instance.
	 */
	public skip(value?: SkipType): ETGuildQueue;

	/**
	 * Seeks to a specific position in the currently playing track.
	 *
	 * @param value - The timestamp (in seconds) to seek to. Defaults to `0` (start of the track).
	 *
	 * @returns Updated instance.
	 */
	public seek(value?: number): ETGuildQueue;

	/**
	 * Generates a progress bar for the currently playing track.
	 *
	 * @param pointer - The character representing the current position in the progress bar.
	 * @param line - The character used to fill the progress bar.
	 * @param size - The total length of the progress bar in characters.
	 *
	 * @returns An object representing the track's progress.
	 */
	public progress(
		size?: number,
		pointer?: string,
		line?: string
	): TrackProgress;

	/**
	 * Shuffles the tracks in the player queue, keeping the first track in place.
	 *
	 * @returns Updated instance.
	 */
	public shuffle(): ETGuildQueue;

	/**
	 * Fetches the lyrics of the current track.
	 *
	 * @returns The lyrics of the current track.
	 */
	public lyrics(): Promise<string>;

	/**
	 * Starts or resumes playback of the current track, optionally seeking to a specific position.
	 *
	 * @param seek - The position (in seconds) to start playback from. Defaults to `0` (start of the track).
	 */
	public play(seek?: number): void;

	/**
	 * Destroys the current queue, disconnects the audio connection, and cleans up resources.
	 *
	 * @returns Updated instance.
	 */
	public destroy(): ETGuildQueue;

	/**
	 * Saves the current state of the queue for future use.
	 * This can be used to persist the queue's tracks and state in memory or an external storage.
	 *
	 * @returns Updated instance.
	 */
	public save(): ETGuildQueue;

	/**
	 * Converts the queue state into a JSON-serializable object.
	 *
	 * @returns An object representing the current state of the queue.
	 */
	public toJSON(): GuildQueue;

	/**
	 * Generates and returns a FFMPEG stream URL.
	 *
	 * @private
	 * @returns Resolves to the generated stream URL.
	 */
	#createStreamUrl(): Promise<string>;
}
