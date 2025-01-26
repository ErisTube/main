/**
 * Converts a duration from seconds to an array representing hours, minutes, and seconds.
 *
 * @callback formatDuration
 *
 * @param {number} seconds - The duration in seconds to be converted.
 *
 * @returns {number[]} Formatted duration.
 */
export function formatDuration(seconds: number): number[] {
	return [
		Math.floor(seconds / 3600),
		Math.floor((seconds % 3600) / 60),
		seconds % 60,
	];
}
