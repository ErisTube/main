// Import requirements
import { Readable } from 'stream';
import { spawn } from 'child_process';

/**
 * Manages the creation and processing of audio streams using FFmpeg.
 *
 * @class
 * @classdesc ErisTube stream manager
 */
export class ETStream {
	private _pipe: string;
	private _path: string;
	private _args: string[];
	private _options: string[];

	private _output: Readable;

	/**
	 * Creates a new ETStream instance.
	 *
	 * @constructor
	 *
	 * @param {string} path - The path to the audio file or FFmpeg executable.
	 */
	constructor(path: string) {
		/**
		 * The pipe destination for FFmpeg output.
		 *
		 * @private
		 * @type {string}
		 */
		this._pipe = 'pipe:1';

		/**
		 * The path to the audio file or FFmpeg executable.
		 *
		 * @private
		 * @type {string}
		 */
		this._path = path;

		/**
		 * The list of arguments to pass to the FFmpeg process.
		 *
		 * @private
		 * @type {Array<string>}
		 */
		this._args = [
			'-reconnect',
			'1',
			'-reconnect_streamed',
			'1',
			'-reconnect_delay_max',
			'5',
			'-analyzeduration',
			'0',
			'-loglevel',
			'0',
			'-ar',
			'48000',
			'-ac',
			'2',
			'-f',
			's16le',
		];
		// this._args = [
		// 	'-analyzeduration',
		// 	'0',
		// 	'-loglevel',
		// 	'0',
		// 	'-ar',
		// 	'48000',
		// 	'-ac',
		// 	'2',
		// 	'-f',
		// 	's16le',
		// ];

		/**
		 * Additional options for FFmpeg execution.
		 *
		 * @private
		 * @type {Array<string>}
		 */
		this._options = [];

		/**
		 * The resulting output stream from the FFmpeg process.
		 *
		 * @private
		 * @type {Readable}
		 */
		this._output = null;
	}

	/**
	 * Sets additional options for the FFmpeg process.
	 *
	 * @param {...string[]} args - A list of arguments to pass to the FFmpeg process.
	 *
	 * @returns {ETStream} Updated instance.
	 */
	public setOptions(...args: string[]): ETStream {
		this._options.push(...args);

		return this;
	}

	/**
	 * Creates a new readable stream from the FFmpeg process output.
	 *
	 * @returns {Readable} The readable stream containing the processed audio data.
	 */
	public create(): Readable {
		const proc = spawn(
			'ffmpeg',

			['-i', this._path, ...this._args, ...this._options, this._pipe],

			{
				stdio: 'pipe',
			}
		);

		const stream = Readable.from(proc.stdout);

		Object.defineProperty(
			(stream as any)._readableState,
			'highWaterMark',

			{
				value: 1 << 25,
				writable: true,
			}
		);

		this._output = stream;

		return this._output;
	}

	/**
	 * Terminates the current stream and releases the resources.
	 * If the stream is already destroyed or doesn't exist, it does nothing.
	 *
	 * @returns {Readable} The destroyed stream.
	 */
	public kill(): Readable {
		if (!this._output || this._output?.destroyed) return null;

		const stream = this._output.destroy();
		this._output = null;

		return stream;
	}
}
