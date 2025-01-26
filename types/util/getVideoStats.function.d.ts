import { TrackStats } from '..';

/**
 * Fetches YouTube video statistics, including likes, dislikes, and views.
 *
 * @param videoId - The ID of the YouTube video.
 *
 * @returns Resolves to an object containing video statistics.
 */
export function getVideoStats(videoId: string): Promise<TrackStats>;
