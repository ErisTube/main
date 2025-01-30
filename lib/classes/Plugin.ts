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
	public abstract name: string;

	/**
	 * Plugin type
	 *
	 * @readonly
	 * @type {ETPluginType}
	 */
	public abstract type: ETPluginType;

	/**
	 * Plugin version
	 *
	 * @readonly
	 * @type {string}
	 */
	public abstract version: string;

	/**
	 * Plugin description
	 *
	 * @readonly
	 * @type {string}
	 */
	public abstract description: string;

	/**
	 * ErisTube instance
	 *
	 * @readonly
	 * @type {ErisTube}
	 */
	public abstract eristube: ErisTube;

	/**
	 * Resolves the provided data and returns a processed result.
	 *
	 * @param {any[]} data - The data to be resolved.
	 *
	 * @returns {any | Promise<any>} The resolved result, which may be synchronous or asynchronous.
	 */
	public abstract resolve(...data: any[]): any | Promise<any>;

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
