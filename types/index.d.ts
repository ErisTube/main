import { Client } from 'eris';

import { ETEmitter } from './classes/Emitter';
import { ETFilters } from './classes/Filters';
import { ETPlugin } from './classes/Plugin';
import { ETVoice } from './classes/Voice';

import { ETEvents } from './Events';
import { ETOptions } from './Options';

export declare class ErisTube extends ETEmitter<ETEvents> {
	constructor(client: Client, options?: ETOptions);

	private readonly _client: Client;
	private readonly _errored: boolean;

	public plugins: Map<string, ETPlugin>;

	public voice: ETVoice;
	public filters: ETFilters;

	/**
	 * Indicates whether the ErisTube is ready.
	 *
	 * @returns `True` if the ErisTube is ready, otherwise `false`.
	 */
	public get isReady(): boolean;

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

export * from './util/formatDuration.function';
export * from './util/formatNumber.function';
export * from './util/getVideoStats.function';
export * from './util/isValidURL.function';
export * from './util/normalizeArray.function';

export * from './Options';
export * from './Events';

export * from './Enums';
export * from './Data';
