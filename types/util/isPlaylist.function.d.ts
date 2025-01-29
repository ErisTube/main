import { SearchTrackData, SearchPlaylist } from '../';

/**
 * Determines if the provided data represents a playlist.
 *
 * @callback isPlaylist
 *
 * @param data - A single track data object or an array containing track data and/or playlist objects.
 *
 * @returns Returns `true` if the data represents a playlist, otherwise `false`.
 */
export function isPlaylist(
	data: SearchTrackData | (SearchTrackData | SearchPlaylist)[]
): boolean;
