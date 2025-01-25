export declare class ETPlugin {
	public name: string;
	public version: string;
	public description: string;

	/**
	 * Abstract method that must be implemented by subclasses to process the provided data.
	 *
	 * @param data - The data to be processed.
	 *
	 * @returns A promise that resolves when processing is complete.
	 */
	public resolve<T = any>(data: T): Promise<any>;
}
