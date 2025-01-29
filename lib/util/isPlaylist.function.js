"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlaylist = isPlaylist;
/**
 * Determines if the provided data represents a playlist.
 *
 * @callback isPlaylist
 *
 * @param {SearchTrackData | (SearchTrackData | SearchPlaylist)[]} data - A single track data object or an array containing track data and/or playlist objects.
 *
 * @returns {boolean} Returns `true` if the data represents a playlist, otherwise `false`.
 */
function isPlaylist(data) {
    return ((Array.isArray(data) && 'items' in data[0]) ||
        (!Array.isArray(data) && 'items' in data));
}
