/**
 * ErisTube Error instance
 *
 * @private
 *
 * @class
 * @classdesc Custom error class.
 */
export class ETError extends Error {
	public readonly name: string;

	/**
	 * Constructs a new instance of ETError.
	 *
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);

		/**
		 * Name of the error.
		 *
		 * @type {string}
		 */
		this.name = 'ErisTube Error';

		Error.captureStackTrace(this, this.constructor);
		Object.setPrototypeOf(this, ETError.prototype);
	}
}
