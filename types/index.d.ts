import { Client } from 'eris';

import { ETEmitter } from './classes/Emitter';
import { ETFilters } from './classes/Filters';
import { ETPlugin } from './classes/Plugin';
import { ETVoice } from './classes/Voice';
import { ETGuildQueue } from './classes/GuildQueue';

import { ETEvents } from './Events';
import { ETOptions } from './Options';
import { SearchPlaylist, SearchTrackData, SearchType } from './Data';

export declare class ErisTube extends ETEmitter<ETEvents> {
	constructor(client: Client, options?: ETOptions);

	private readonly _client: Client;
	private readonly _errored: boolean;

	public plugins: Map<string, ETPlugin>;
	public queues: Map<string, ETGuildQueue>;

	public voice: ETVoice;
	public filters: ETFilters;

	/**
	 * Indicates whether the ErisTube is ready.
	 *
	 * @returns `True` if the ErisTube is ready, otherwise `false`.
	 */
	public get isReady(): boolean;

	/**
	 * Searches for tracks or playlists based on the given query.
	 *
	 * @param query - The search query (e.g., song name, artist, or playlist title).
	 * @param type - The type of search (`'track'` or `'playlist'`).
	 * @param count - The maximum number of results to return. If `null`, returns all available results.
	 *
	 * @returns Resolves to either a single track, an array of tracks, or an array of playlists.
	 */
	public search(
		query: string,
		type?: SearchType,
		count?: number
	): Promise<SearchTrackData | SearchTrackData[] | SearchPlaylist[]>;

	/**
	 * Registers an array of plugins and ensures there are no duplicates.
	 *
	 * @private
	 *
	 * @param plugins - An array of plugins to register.
	 *
	 * @returns A map containing the registered plugins, where the key is the plugin name.
	 */
	#registerPlugins(plugins: ETPlugin[]): Map<string, ETPlugin>;

	/**
	 * Initializes and configures the module with the provided options.
	 *
	 * @private
	 *
	 * @param options - The configuration options to initialize.
	 *
	 * @returns The processed and validated configuration options.
	 */
	#initConfiguration(options: ETOptions): ETOptions;

	/**
	 * Initializes the ErisTube instance.
	 * Sets up necessary configurations and event listeners.
	 *
	 * @private
	 */
	#init(): void;
}

export * from './classes/Emitter';
export * from './classes/Voice';
export * from './classes/Error';
export * from './classes/Plugin';
export * from './classes/Filters';
export * from './classes/Stream';
export * from './classes/GuildQueue';

export * from './util/formatDuration.function';
export * from './util/formatNumber.function';
export * from './util/getVideoStats.function';
export * from './util/isValidURL.function';
export * from './util/normalizeArray.function';
export * from './util/isPlaylist.function';

export * from './Options';
export * from './Events';

export * from './Enums';
export * from './Data';
