import { Client, Member, Message, User, VoiceConnection } from 'eris';
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
	textChannelId: string;
}

export interface QueueTrack extends SearchTrackData {
	requested: User;
}

export interface GuildQueue<T extends Record<string, any>> {
	trackIndex: number;

	startedAt: number;
	endedAt: number;

	guildId: string;
	textChannelId: string;
	connection: VoiceConnection;
	volume: number;
	filter: string;
	state: QueueState;
	repeat: QueueRepeat;

	tracks: QueueTrack[];
	history: QueueTrack[];

	custom: T;
}

export interface TrackProgress {
	bar: string;
	percents: number;
}

export interface COptions {
	client: Client;

	count?: number;
	timeout?: number;
	isReactionsAdd?: boolean;

	member: Member;
	message: Message;
}

export type SearchType = 'track' | 'playlist';
export type CollectorType = 'reaction' | 'message';
