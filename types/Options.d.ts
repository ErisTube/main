import { ETPlugin } from '.';

export interface ETOptions {
	debug?: boolean;
	plugins?: ETPlugin[];

	settings?: {
		defaultVolume?: number;
		searchResultsCount?: number;
	};
}
