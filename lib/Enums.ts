export enum ETPluginType {
	SEARCH = 'searchProvider',
	LYRICS = 'lyricsProvider',
	COLLECTORS = 'collectorsProvider',
}

/**
 * @typedef {object} QueueState
 *
 * @prop {number} INIT Playback in initialization progress
 * @prop {number} PAUSED Playback is paused (waiting to be restored)
 * @prop {number} PLAYING Playback is active and not stopped
 */
export enum QueueState {
	INIT = -1,
	PAUSED = 0,
	PLAYING = 1,
}

/**
 * @typedef {object} QueueRepeat
 *
 * @prop {number} NONE Playback is not repeated
 * @prop {number} TRACK Loop only current track
 * @prop {number} QUEUE Loop all tracks in queue
 * @prop {number} AUTOPLAY Auto playback of the queue
 */
export enum QueueRepeat {
	NONE = -1,
	TRACK = 0,
	QUEUE = 1,
	AUTOPLAY = 2,
}

/**
 * @typedef {object} SkipType
 *
 * @prop {number} PREVIOUS Skips to the previous track
 * @prop {number} NEXT Skips to the next track
 */
export enum SkipType {
	PREVIOUS = 0,
	NEXT = 1,
}
