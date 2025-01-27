import { Readable } from 'stream';

export declare class ETStream {
	constructor(path: string);

	private _pipe: string;
	private _path: string;
	private _args: string[];
	private _options: string[];

	private _output: Readable;

	/**
	 * Sets additional options for the FFmpeg process.
	 *
	 * @param args - A list of arguments to pass to the FFmpeg process.
	 *
	 * @returns Updated instance.
	 */
	public setOptions(...args: string[]): ETStream;

	/**
	 * Creates a new readable stream from the FFmpeg process output.
	 *
	 * @returns The readable stream containing the processed audio data.
	 */
	public create(): Readable;

	/**
	 * Terminates the current stream and releases the resources.
	 * If the stream is already destroyed or doesn't exist, it does nothing.
	 *
	 * @returns The destroyed stream.
	 */
	public kill(): Readable;
}
