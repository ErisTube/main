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
