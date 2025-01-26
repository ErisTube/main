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

export interface TrackArtist {
	name: string;
	url: string;
}

export interface TrackDuration {
	value: number;
	format: string[];
}
