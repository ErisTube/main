// Import requirements
import { Readable } from 'stream';
import ytdl from '@distube/ytdl-core';
import { VoiceConnection } from 'eris';

import { ETStream } from './Stream';
import { ErisTube } from '../ErisTube';

// Import types
import { QueueRepeat, QueueState } from '../Enums';
import {
	GuildQueue,
	QueueOptions,
	QueueTrack,
	SearchTrackData,
	SearchType,
} from '../../types';
import { normalizeArray, RestOrArray } from '../util/normalizeArray.function';

export class ETGuildQueue {
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

	constructor(eristube: ErisTube, options: QueueOptions) {
		/**
		 * ErisTube instance
		 *
		 * @private
		 * @type {ErisTube}
		 */
		this._eristube = eristube;

		/**
		 * ErisTube stream manager
		 *
		 * @private
		 * @type {ETStream}
		 */
		this._stream = null;

		/**
		 * FFMPEG readable output
		 *
		 * @private
		 * @type {Readable}
		 */
		this._output = null;

		/**
		 * Current seek value
		 *
		 * @private
		 * @type {number}
		 */
		this._seek = null;

		/**
		 * Current queue track index
		 *
		 * @private
		 * @type {number}
		 */
		this._trackIndex = 0;

		/**
		 * Current queue autoplay list
		 *
		 * @private
		 * @type {SearchTrackData[]}
		 */
		this._autoplay = [];

		/**
		 * Current queue start timestamp
		 *
		 * @type {number}
		 */
		this.startedAt = null;

		/**
		 * Current queue end timestamp
		 *
		 * @type {number}
		 */
		this.endedAt = null;

		/**
		 * Queue guild id
		 *
		 * @type {string}
		 */
		this.guildId = options.guildId;

		/**
		 * Eris voice connection
		 *
		 * @type {VoiceConnection}
		 */
		this.connection = this._eristube._client.voiceConnections.get(this.guildId);

		/**
		 * Queue playback volume
		 *
		 * @type {number}
		 */
		this.volume = this._eristube.options.settings.defaultVolume / 100;

		/**
		 * Queue playback filter
		 *
		 * @type {string}
		 */
		this.filter = 'anull';

		/**
		 * Queue playback state
		 *
		 * @type {QueueState}
		 */
		this.state = QueueState.INIT;

		/**
		 * Queue playback repeat mode
		 *
		 * @type {QueueRepeat}
		 */
		this.repeat = QueueRepeat.NONE;

		/**
		 * Queue tracks list
		 *
		 * @type {QueueTrack[]}
		 */
		this.tracks = [];

		/**
		 * Queue tracks history list
		 *
		 * @type {QueueTrack[]}
		 */
		this.history = [];

		this.connection?.on('end', async () => {
			const index = this.tracks.length - 1;

			if (this.tracks.length && this._trackIndex <= index) {
				if (this.repeat != QueueRepeat.NONE) {
					if (this.repeat === QueueRepeat.TRACK) {
						this._stream.kill();
						this.connection.piper.stop(null, null);

						return this.play();
					}

					if (this.repeat === QueueRepeat.QUEUE) {
						if (this._trackIndex + 1 >= this.tracks.length) {
							this._trackIndex = 0;
						} else {
							this._trackIndex++;
						}

						this._stream.kill();
						this.connection.piper.stop(null, null);

						return this.play();
					}

					if (this.repeat === QueueRepeat.AUTOPLAY) {
						const track = this.tracks[this._trackIndex];

						const query = track.title.includes(track.artist.name)
							? `${track.title}`
							: `${track.artist.name
									.replace('- Topic', '')
									.replace('- topic', '')
									.replace('- тема', '')
									.replace('- Тема', '')} ${track.title}`;

						if (!this._autoplay.length) {
							const results = (await this._eristube.search(
								query,
								'track',
								50
							)) as SearchTrackData[];

							for (const result of results) {
								if (
									!this._autoplay.includes(result) &&
									!this.history.find(h => h.id === result.id)
								) {
									this._autoplay.push(result);
								}
							}
						}

						this.addTracks(this._eristube._client.user.id, this._autoplay[0]);

						this._autoplay.shift();

						this._trackIndex++;
						this._stream.kill();
						this.connection.piper.stop(null, null);

						if (!this.tracks[this._trackIndex]?.id) {
							return this.destroy();
						}

						return this.play();
					}

					this.destroy();
					return this._eristube.emit(
						'error',
						new Error('Failed to repeat queue!')
					);
				} else {
					this._trackIndex++;
					this._stream.kill();
					this.connection.piper.stop(null, null);

					if (!this.tracks[this._trackIndex]?.id) {
						return this.destroy();
					}

					return this.play();
				}
			} else {
				return this.destroy();
			}
		});
	}

	/**
	 * Number of tracks in current queue.
	 *
	 * @type {number} The total count of tracks.
	 */
	public get size(): number {
		return this.tracks.length;
	}

	/**
	 * Checks if the queue is empty.
	 *
	 * @type {boolean} `True` if the queue is empty, `false` otherwise.
	 */
	public get isEmpty(): boolean {
		return !this.tracks?.length;
	}

	/**
	 * Retrieves the currently playing track from the queue.
	 *
	 * @type {QueueTrack} The currently playing track.
	 */
	public get nowPlaying(): QueueTrack {
		return this.tracks[this._trackIndex];
	}

	/**
	 * Retrieves the index of the currently playing track in the queue.
	 *
	 * @type {number} The index of the currently playing track.
	 */
	public get currentTrackId(): number {
		return this._trackIndex;
	}

	/**
	 * Adds tracks to the guild queue.
	 *
	 * @param {string} userId - Discord user id.
	 * @param {RestOrArray<SearchTrackData>} tracks - The tracks to add. Accepts both array and variadic arguments.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public addTracks(
		userId: string,
		...tracks: RestOrArray<SearchTrackData>
	): ETGuildQueue {
		const results: QueueTrack[] = [];
		const normalizedTracks = normalizeArray(tracks);

		for (const track of normalizedTracks) {
			results.push({
				...track,
				requested: this._eristube._client.users.get(userId),
			});
		}

		if (this.tracks.length) {
			this.tracks.push(...results);
		} else {
			this.tracks = results;
		}

		this._eristube.emit('tracksAdded', this.guildId, results);

		return this;
	}

	/**
	 * Starts or resumes playback of the current track, optionally seeking to a specific position.
	 *
	 * @param {number} [seek=0] - The position (in seconds) to start playback from. Defaults to `0` (start of the track).
	 *
	 * @returns {void}
	 */
	public async play(seek: number = 0): Promise<void> {
		if (this._output) {
			this._output?.destroy();
			this._output = null;
		}

		const url = await this.#createstreamUrl();

		this._seek = null;
		this._stream = new ETStream(url).setOptions('-af', this.filter);

		if (seek) {
			this._seek = seek;
			this._stream.setOptions('-ss', seek.toString());
		}

		this._output = this._stream.create();

		Object.defineProperty(
			(this._output as any)._readableState,
			'highWaterMark',
			{
				value: 1 << 25,
				writable: true,
			}
		);

		this._output.once('readable', () => {
			this._eristube.emit(
				'trackStarted',
				this.guildId,
				this.tracks[this._trackIndex]
			);
		});

		this._output.removeAllListeners('error');

		this._output.once('error', e => {
			this.destroy();
			return this._eristube.emit('error', e);
		});

		this.connection.piper.removeAllListeners('error');

		this.connection.piper.once('error', e => {
			this.destroy();
			return this._eristube.emit('error', e);
		});

		if (!this.startedAt) {
			this.startedAt = Date.now();
		}

		this.state = QueueState.PLAYING;
		this.connection.setVolume(this.volume);
		this.connection.play(this._output, { format: 'pcm', inlineVolume: true });

		this.save();
	}

	/**
	 * Destroys the current queue, disconnects the audio connection, and cleans up resources.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public destroy(): ETGuildQueue {
		const connectionId = this.connection?.id;

		if (connectionId) {
			this.connection.removeAllListeners();
			this.connection.piper.removeAllListeners();

			this.connection.piper.stop(null, null);
			this.connection.disconnect();
			this.connection = null;
		}

		this._output?.destroy();
		this._output = null;

		this.endedAt = Date.now();
		this._eristube.queues.delete(connectionId);
		this._eristube.emit('queueEnded', this.toJSON());

		return this;
	}

	/**
	 * Saves the current state of the queue for future use.
	 * This can be used to persist the queue's tracks and state in memory or an external storage.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public save(): ETGuildQueue {
		this._eristube.queues.set(this.connection.id, this);

		return this;
	}

	/**
	 * Converts the queue state into a JSON-serializable object.
	 *
	 * @returns {GuildQueue} An object representing the current state of the queue.
	 */
	public toJSON(): GuildQueue {
		return {
			trackIndex: this._trackIndex,

			startedAt: this.startedAt,
			endedAt: this.endedAt,

			guildId: this.guildId,
			connection: this.connection,
			volume: this.volume,
			filter: this.filter,
			state: this.state,
			repeat: this.repeat,

			tracks: this.tracks,
			history: this.history,
		};
	}

	/**
	 * Generates and returns a FFMPEG stream URL.
	 *
	 * @private
	 * @returns {Promise<string>} Resolves to the generated stream URL.
	 */
	async #createstreamUrl(): Promise<string> {
		const info = await ytdl.getInfo(this.tracks[this._trackIndex].url);

		let results: Array<ytdl.videoFormat> = [];

		info.formats.forEach(videoFormat => {
			if (
				videoFormat.codecs === 'opus' &&
				videoFormat.container === 'webm' &&
				videoFormat.audioSampleRate === '48000' &&
				videoFormat.audioQuality === 'AUDIO_QUALITY_MEDIUM'
			)
				results.push(videoFormat);
		});

		return results[0].url;
	}
}
