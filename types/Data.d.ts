import { User, VoiceConnection } from 'eris';
import { QueueRepeat, QueueState } from './Enums';

export interface TrackStats {
	views: number;
	likes: number;
	dislikes: number;
	rating: number;
}

export interface SearchTrackData {
	id?: string;
	url: string;
	title: string;
	artist: TrackArtist;
	description?: string;
	thumbnail: string;
	duration: TrackDuration;
}

export interface SearchPlaylist {
	id: string;
	url: string;
	title: string;
	thumbnail: string;
	duration: PlaylistDuration;

	items: SearchTrackData[];
}

export interface TrackArtist {
	name: string;
	url: string;
}

type PlaylistDuration = TrackDuration;

export interface TrackDuration {
	value: number;
	format: string[];
}

export interface PlaybackFilter {
	name: string;
	value: string;
}

export interface QueueOptions {
	guildId: string;
}

export interface QueueTrack extends SearchTrackData {
	requested: User;
}

export interface GuildQueue {
	trackIndex: number;

	startedAt: number;
	endedAt: number;

	guildId: string;
	connection: VoiceConnection;
	volume: number;
	filter: string;
	state: QueueState;
	repeat: QueueRepeat;

	tracks: QueueTrack[];
	history: QueueTrack[];
}

export interface TrackProgress {
	bar: string;
	percents: number;
}

export type SearchType = 'track' | 'playlist';
