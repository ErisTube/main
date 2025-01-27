import { PlaybackFilter, RestOrArray } from '../index';

export declare class ETFilters {
	constructor(debug?: boolean);

	private _data: PlaybackFilter[];
	private _debug: boolean;

	/**
	 * Registers new audio filters.
	 *
	 * @param data - One or more `PlaybackFilter` objects or arrays of `PlaybackFilter` objects.
	 *
	 * @returns The updated list of registered filters.
	 */
	public register(...data: RestOrArray<PlaybackFilter>): PlaybackFilter[];

	/**
	 * Retrieves a registered filter by its name.
	 *
	 * @param name - The name of the filter to retrieve.
	 *
	 * @returns The found filter, or `null` if no filter matches the given name.
	 */
	public get(name: string): PlaybackFilter;

	/**
	 * Unregister one or more filters by name.
	 *
	 * @param data - One or more filter names to remove.
	 *
	 * @returns The updated list of registered filters.
	 */
	public unregister(...data: string[]): PlaybackFilter[];

	/**
	 * Retrieves all registered filters.
	 *
	 * @returns The list of all registered filters.
	 */
	public all(): PlaybackFilter[];
}
