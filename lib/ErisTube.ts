// Import requirements
import { Client, Collection } from 'eris';

// Import addons
import { ETError } from './classes/Error';
import { ETVoice } from './classes/Voice';
import { ETEmitter } from './classes/Emitter';

// Import types
import { ETEvents, ETOptions, ETPlugin } from '../types';

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

	public voice: ETVoice;

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
		 * ErisTube voice manager
		 *
		 * @type {ETVoice}
		 */
		this.voice = new ETVoice(this._client);

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

		for (const plugin of plugins) {
			if (registered.has(plugin.name)) {
				throw new ETError(`Plugin '${plugin.name}' already registered!`);
			}

			registered.set(plugin.name, plugin);
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
		if (typeof options?.debug != 'boolean') options.debug = true;
		if (!Array.isArray(options?.plugins)) options.plugins = [];

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
