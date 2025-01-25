/**
 * @abstract
 *
 * @class
 * @classdesc ErisTube plugin abstract class
 */
export abstract class ETPlugin {
	/**
	 * Plugin name
	 *
	 * @readonly
	 * @type {string}
	 */
	abstract readonly name: string;

	/**
	 * Plugin version
	 *
	 * @readonly
	 * @type {string}
	 */
	abstract readonly version: string;

	/**
	 * Plugin description
	 *
	 * @readonly
	 * @type {string}
	 */
	abstract readonly description: string;

	/**
	 * Abstract method that must be implemented by subclasses to process the provided data.
	 *
	 * @abstract
	 *
	 * @param {any} data - The data to be processed.
	 *
	 * @returns {Promise<any>} A promise that resolves when processing is complete.
	 */
	abstract resolve<T = any>(data: T): Promise<any>;
}
