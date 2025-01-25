// Import requirements
import { ErisTube } from '../ErisTube';
import { ETPluginType } from '../Enums';

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
	 * Plugin type
	 *
	 * @readonly
	 * @type {ETPluginType}
	 */
	abstract readonly type: ETPluginType;

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
	 * ErisTube instance
	 *
	 * @readonly
	 * @type {ErisTube}
	 */
	abstract eristube: ErisTube;

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

	/**
	 * Initializes the ErisTube instance.
	 *
	 * @param {ErisTube} e - The ErisTube instance to initialize.
	 *
	 * @returns {ETPlugin} Updated instance.
	 */
	public init(e: ErisTube): ETPlugin {
		this.eristube = e;
		return this;
	}
}
