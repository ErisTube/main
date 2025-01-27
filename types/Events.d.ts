import { ErisTube, GuildQueue, QueueTrack } from '.';

export interface ETEvents {
	ready: [p: ErisTube];
	error: [e: Error];

	queueEnded: [q: GuildQueue];

	tracksAdded: [gId: string, d: QueueTrack[]];
	trackStarted: [gId: string, d: QueueTrack];
}
