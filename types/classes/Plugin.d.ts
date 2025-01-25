import { ErisTube, ETPluginType } from '..';

export declare class ETPlugin {
	public name: string;
	public type: ETPluginType;
	public version: string;
	public description: string;
	public eristube: ErisTube;

	/**
	 * Abstract method that must be implemented by subclasses to process the provided data.
	 *
	 * @param data - The data to be processed.
	 *
	 * @returns A promise that resolves when processing is complete.
	 */
	public resolve<T = any>(data: T): Promise<any>;

	/**
	 * Initializes the ErisTube instance.
	 *
	 * @param e - The ErisTube instance to initialize.
	 *
	 * @returns Updated instance.
	 */
	public init(e: ErisTube): ETPlugin;
}
