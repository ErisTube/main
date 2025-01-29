export enum ETPluginType {
	SEARCH = 'searchProvider',
	LYRICS = 'lyricsProvider',
	COLLECTORS = 'collectorsProvider',
}

export enum QueueState {
	INIT = -1,
	PAUSED = 0,
	PLAYING = 1,
}

export enum QueueRepeat {
	NONE = -1,
	TRACK = 0,
	QUEUE = 1,
	AUTOPLAY = 2,
}

export enum SkipType {
	PREVIOUS = 0,
	NEXT = 1,
}
