import { ErisTube, ETPluginType } from '..';

export declare class ETPlugin {
	public name: string;
	public type: ETPluginType;
	public version: string;
	public description: string;
	public eristube: ErisTube;

	/**
	 * Resolves the provided data and returns a processed result.
	 *
	 * @template T - The type of the input data (defaults to `any`).
	 *
	 * @param {...T[]} data - The data to be resolved.
	 *
	 * @returns {any | Promise<any>} The resolved result, which may be synchronous or asynchronous.
	 */
	public abstract resolve<T = any>(...data: T[]): any | Promise<any>;

	/**
	 * Initializes the ErisTube instance.
	 *
	 * @param e - The ErisTube instance to initialize.
	 *
	 * @returns Updated instance.
	 */
	public init(e: ErisTube): ETPlugin;
}
