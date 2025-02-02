// Import requirements
import { Readable } from 'stream';
import ytdl from '@distube/ytdl-core';
import { VoiceConnection } from 'eris';

import { ETError } from './Error';
import { ETStream } from './Stream';
import { ErisTube } from '../ErisTube';
import { ETPluginType, QueueRepeat, QueueState, SkipType } from '../Enums';
import { normalizeArray, RestOrArray } from '../util/normalizeArray.function';

// Import types
import {
	GuildQueue,
	QueueOptions,
	QueueTrack,
	SearchTrackData,
	TrackProgress,
} from '../../types';

export class ETGuildQueue<T extends Record<string, any>> {
	private _eristube: ErisTube;
	private _stream: ETStream;
	private _output: Readable;

	private _seek: number;
	private _trackIndex: number;
	private _autoplay: SearchTrackData[];

	public startedAt: number;
	public endedAt: number;

	public readonly guildId: string;
	public textChannelId: string;
	public connection: VoiceConnection;
	public volume: number;
	public filter: string;
	public state: QueueState;
	public repeat: QueueRepeat;

	public tracks: QueueTrack[];
	public history: QueueTrack[];

	public custom: T;

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
		 * Queue text channel id
		 *
		 * @type {string}
		 */
		this.textChannelId = options.textChannelId;

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

		/**
		 * Queue custom data
		 *
		 * @type {T}
		 */
		this.custom = {} as T;

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
	): this {
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
	 * Applies audio filters to the current FFmpeg stream.
	 *
	 * @param {...string[]} values - A list of FFmpeg audio filters, such as `"volume=1.5"` or `"atempo=1.2"`.
	 *                               If no filters are provided, the default `anull` filter is applied.
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public setFilter(...values: string[]): this {
		let value = (values ?? ['anull']).join(',');

		this.filter = value;
		this._output = this._stream.kill();
		this.connection.piper.stop(null, null);

		this.play();

		return this;
	}

	/**
	 * Sets the playback volume for the current stream and restarts playback.
	 *
	 * @param {number} [value=100] - The desired volume level as a percentage (0 to 100 or higher).
	 * If not provided, the default volume from the player configuration will be used.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public setVolume(value?: number): this {
		value = Math.floor(
			(value ?? this._eristube.options.settings.defaultVolume) / 100
		);

		this.volume = value;
		this.connection.setVolume(value);

		return this;
	}

	/**
	 * Sets the playback state of the queue.
	 *
	 * @param {QueueState} [value=QueueState.PLAYING] - The new state of the queue. Defaults to `QueueState.PLAYING`.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public setState(value: QueueState = QueueState.PLAYING): this {
		if (value === QueueState.PAUSED) {
			this.connection.pause();
		}

		if (value === QueueState.PLAYING) {
			this.connection.resume();
		}

		this.state = value;

		return this;
	}

	/**
	 * Sets the repeat mode for the queue.
	 *
	 * @param {QueueRepeat} [value=QueueRepeat.NONE] - The repeat mode to set. Defaults to `QueueRepeat.TRACK`.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public setRepeat(value: QueueRepeat = QueueRepeat.NONE): this {
		this.repeat = value;

		return this;
	}

	/**
	 * Sets a custom value in the queue's custom properties.
	 *
	 * @param {K} key - The key of the custom property to set.
	 * @param {T[K]} value - The value to assign to the specified key.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public setCustomValue<K extends keyof T>(key: K, value: T[K]): this {
		this.custom[key] = value;
		return this;
	}

	/**
	 * Retrieves a custom value from the queue's custom properties.
	 *
	 * @param {K} key - The key of the custom property to retrieve.
	 *
	 * @returns {T[K]} The value associated with the specified key.
	 */
	public getCustomValue<K extends keyof T>(key: K): T[K] {
		return this.custom[key];
	}

	/**
	 * Skips the currently playing track in the queue.
	 *
	 * @param {SkipType} [value=SkipType.NEXT] - The direction to skip. Defaults to `SkipType.NEXT`.
	 * Use `SkipType.NEXT` to skip to the next track, or `SkipType.PREVIOUS` to go back to the previous track.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public skip(value: SkipType = SkipType.NEXT): this {
		if (value === SkipType.NEXT) {
			this._trackIndex++;

			if (this._trackIndex > this.tracks.length - 1) {
				this._trackIndex = 0;
			}
		} else {
			this._trackIndex--;

			if (this._trackIndex < 0) {
				this._trackIndex = this.tracks.length - 1;
			}
		}

		this._stream.kill();
		this.connection.piper.stop(null, null);

		this.play();

		return this;
	}

	/**
	 * Seeks to a specific position in the currently playing track.
	 *
	 * @param {number} [value=0] - The timestamp (in seconds) to seek to. Defaults to `0` (start of the track).
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public seek(value: number = 0): this {
		this._stream.kill();
		this.connection.piper.stop(null, null);

		this.play(value);

		return this;
	}

	/**
	 * Generates a progress bar for the currently playing track.
	 *
	 * @param {string} [pointer='●'] - The character representing the current position in the progress bar.
	 * @param {string} [line='▬'] - The character used to fill the progress bar.
	 * @param {number} [size=20] - The total length of the progress bar in characters.
	 *
	 * @returns {TrackProgress} An object representing the track's progress.
	 */
	public progress(
		size: number = 20,
		pointer: string = '●',
		line: string = '▬'
	): TrackProgress {
		const total = this.tracks[this._trackIndex].duration.value;
		const current =
			Math.floor((Date.now() - this.connection.current?.startTime) / 1000) +
			(this._seek ?? 0);
		const percent = Math.floor((current / total) * 100);

		if (total <= 0 || current <= 0) {
			return {
				bar: pointer + line.repeat(size),
				percents: 0,
			};
		}

		const progress = Math.min(current / total, 1);
		const filledLength = Math.round(progress * size);
		const bar =
			line.repeat(filledLength) + pointer + line.repeat(size - filledLength);

		return {
			bar: bar,
			percents: percent,
		};
	}

	/**
	 * Shuffles the tracks in the player queue, keeping the first track in place.
	 *
	 * @returns {ETGuildQueue} Updated instance.
	 */
	public shuffle(): this {
		if (this.tracks.length > 2) {
			const current = this.tracks.shift();

			for (let i = this.tracks.length - 1; i > 0; i--) {
				const index = Math.floor(Math.random() * (i + 1));
				[this.tracks[i], this.tracks[index]] = [
					this.tracks[index],
					this.tracks[i],
				];
			}

			this.tracks.unshift(current);
		}

		return this;
	}

	/**
	 * Fetches the lyrics of the current track.
	 *
	 * @returns {Promise<string>} The lyrics of the current track.
	 */
	public async lyrics(): Promise<string> {
		try {
			const plugins = this._eristube.plugins
				.values()
				.toArray()
				.filter(v => v.type === ETPluginType.LYRICS);

			if (!plugins.length) {
				throw new ETError(
					'Could not find the required lyrics provider. Try installing @eristube/lyrics.'
				);
			}

			if (this._eristube.options.debug) {
				console.log(
					`[ErisTube Queue] Found ${plugins.length} lyrics providers!`
				);
			}

			let results: string = undefined;

			const track = this.tracks[this._trackIndex];
			const query = track.title.includes(track.artist.name)
				? `${track.title}`
				: `${track.artist.name
						.replace('- Topic', '')
						.replace('- topic', '')
						.replace('- тема', '')
						.replace('- Тема', '')} ${track.title}`;

			for (const plugin of plugins) {
				results = await plugin.resolve(query);

				if (results != undefined) {
					break;
				}
			}

			if (this._eristube.options.debug) {
				console.log(
					`[ErisTube Queue] Lyrics query: ${query}, success: ${Boolean(
						results?.length
					)}`
				);
			}

			return results;
		} catch (e) {
			throw new ETError(e.message);
		}
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

		const url = await this.#createStreamUrl();

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
	public destroy(): this {
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
	public save(): this {
		this._eristube.queues.set(this.connection.id, this);

		return this;
	}

	/**
	 * Converts the queue state into a JSON-serializable object.
	 *
	 * @returns {GuildQueue<Record<string, any>>} An object representing the current state of the queue.
	 */
	public toJSON(): GuildQueue<Record<string, any>> {
		return {
			trackIndex: this._trackIndex,

			startedAt: this.startedAt,
			endedAt: this.endedAt,

			guildId: this.guildId,
			textChannelId: this.textChannelId,
			connection: this.connection,
			volume: this.volume,
			filter: this.filter,
			state: this.state,
			repeat: this.repeat,

			tracks: this.tracks,
			history: this.history,

			custom: this.custom,
		};
	}

	/**
	 * Generates and returns a FFMPEG stream URL.
	 *
	 * @private
	 * @returns {Promise<string>} Resolves to the generated stream URL.
	 */
	async #createStreamUrl(): Promise<string> {
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
