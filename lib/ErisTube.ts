// Import requirements
import { Client } from 'eris';

// Import addons
import { ETError } from './classes/Error';
import { ETVoice } from './classes/Voice';
import { ETEmitter } from './classes/Emitter';
import { ETFilters } from './classes/Filters';
import { ETGuildQueue } from './classes/GuildQueue';

// Import types
import {
	ETEvents,
	ETOptions,
	ETPlugin,
	SearchPlaylist,
	SearchTrackData,
	SearchType,
} from '../types';
import { ETPluginType } from './Enums';

/**
 * ErisTube class.
 *
 * @class
 * @classdesc ErisTube main class.
 *
 * @extends {ETEmitter<ETEvents>}
 */
export class ErisTube extends ETEmitter<ETEvents> {
	public _client: Client;
	private _errored: boolean;

	public options: ETOptions;
	public plugins: Map<string, ETPlugin>;
	public queues: Map<string, ETGuildQueue>;

	public voice: ETVoice;
	public filters: ETFilters;

	/**
	 * @constructor
	 *
	 * @param {Client} client - Eris client instance.
	 * @param {ETOptions} [options={}] - The configuration options for ErisTube.
	 */
	constructor(client: Client, options: ETOptions = {}) {
		super();

		/**
		 * Eris client
		 *
		 * @private
		 * @type {Client}
		 */
		this._client = client;

		/**
		 * Indicates whether an error has occurred
		 *
		 * @private
		 * @type {boolean}
		 */
		this._errored = false;

		/**
		 * ErisTube options
		 *
		 * @type {ETOptions}
		 */
		this.options = this.#initConfiguration(options);

		/**
		 * ErisTube plugins list
		 *
		 * @type {Map<string, ETPlugin>}
		 */
		this.plugins = this.#registerPlugins(options.plugins);

		/**
		 * ErisTube queues map
		 *
		 * @type {Map<string, ETGuildQueue>}
		 */
		this.queues = new Map();

		/**
		 * ErisTube voice manager
		 *
		 * @type {ETVoice}
		 */
		this.voice = new ETVoice(this._client, this.options.debug);

		/**
		 * ErisTube filters manager
		 *
		 * @type {ETFilters}
		 */
		this.filters = new ETFilters(this.options.debug);

		this.#init();
	}

	/**
	 * Indicates whether the ErisTube is ready.
	 *
	 * @returns {boolean} `True` if the ErisTube is ready, otherwise `false`.
	 */
	public get isReady(): boolean {
		return !this._errored;
	}

	/**
	 * Searches for tracks or playlists based on the given query.
	 *
	 * @param {string} query - The search query (e.g., song name, artist, or playlist title).
	 * @param {SearchType} [type='track'] - The type of search (`'track'` or `'playlist'`). Defaults to `'track'`.
	 * @param {number} [count=null] - The maximum number of results to return. If `null`, returns all available results.
	 *
	 * @returns {Promise<SearchTrackData | SearchTrackData[] | SearchPlaylist[]>} Resolves to either a single track, an array of tracks, or an array of playlists.
	 */
	public async search(
		query: string,
		type: SearchType = 'track',
		count: number = null
	): Promise<SearchTrackData | SearchTrackData[] | SearchPlaylist[]> {
		try {
			const plugins = this.plugins
				.values()
				.filter(p => p.type === ETPluginType.SEARCH)
				.toArray();

			if (!plugins.length) {
				throw new ETError(
					'Could not find the required search provider. Try installing @eristube/youtube.'
				);
			}

			if (this.options.debug) {
				console.log(
					`[ErisTube] Found ${plugins.length} plugins for searching tracks!`
				);
			}

			let results: SearchTrackData | SearchTrackData[] | SearchPlaylist[] =
				undefined;

			for (const plugin of plugins) {
				results = await plugin.resolve({
					type: type,
					query: query,
					count: count ?? this.options.settings.searchResultsCount,
				});

				if (typeof results != 'undefined') {
					break;
				}
			}

			return results;
		} catch (e) {
			throw new ETError(e.message);
		}
	}

	/**
	 * Registers an array of plugins and ensures there are no duplicates.
	 *
	 * @private
	 *
	 * @param {ETPlugin[]} plugins - An array of plugins to register.
	 *
	 * @returns {Map<string, ETPlugin>} A map containing the registered plugins, where the key is the plugin name.
	 */
	#registerPlugins(plugins: ETPlugin[]): Map<string, ETPlugin> {
		const registered = new Map();

		if (this.options.debug) {
			console.log(`[ErisTube] Starting load plugins...`);
		}

		for (const plugin of plugins) {
			if (registered.has(plugin.name)) {
				throw new ETError(`Plugin '${plugin.name}' already registered!`);
			}

			registered.set(plugin.name, plugin);

			if (this.options.debug) {
				console.log(
					`[ErisTube] Plugin '${plugin.name}@${plugin.version}' successfully loaded!`
				);
			}
		}

		return registered;
	}

	/**
	 * Initializes and configures the module with the provided options.
	 *
	 * @private
	 *
	 * @param {ETOptions} options - The configuration options to initialize.
	 *
	 * @returns {ETOptions} The processed and validated configuration options.
	 */
	#initConfiguration(options: ETOptions): ETOptions {
		if (typeof options?.debug != 'boolean') options.debug = false;
		if (!Array.isArray(options?.plugins)) options.plugins = [];

		if (typeof options?.settings != 'object') {
			options.settings = {
				defaultVolume: 10,
				searchResultsCount: 10,
			};
		} else {
			if (typeof options?.settings?.defaultVolume != 'number')
				options.settings.defaultVolume = 10;
			if (typeof options?.settings?.searchResultsCount != 'number')
				options.settings.searchResultsCount = 10;
		}

		return options;
	}

	/**
	 * Initializes the ErisTube instance.
	 * Sets up necessary configurations and event listeners.
	 *
	 * @private
	 *
	 * @returns {void}
	 */
	#init(): void {
		const interval = setInterval(() => {
			if (this._client.ready) {
				clearInterval(interval);
				this.emit('ready', this as any);
			}
		}, 100);
	}
}
