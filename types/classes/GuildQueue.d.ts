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
} from '../index';

export declare class ETGuildQueue {
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
	public connection: VoiceConnection;
	public volume: number;
	public filter: string;
	public state: QueueState;
	public repeat: QueueRepeat;

	public tracks: QueueTrack[];
	public history: QueueTrack[];

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
	#createstreamUrl(): Promise<string>;
}
