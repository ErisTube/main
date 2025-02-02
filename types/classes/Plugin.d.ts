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
	 * @param data - The data to be resolved.
	 *
	 * @returns The resolved result, which may be synchronous or asynchronous.
	 */
	public resolve(...data: any[]): any | Promise<any>;

	/**
	 * Initializes the ErisTube instance.
	 *
	 * @param e - The ErisTube instance to initialize.
	 *
	 * @returns Updated instance.
	 */
	public init(e: ErisTube): ETPlugin;
}
