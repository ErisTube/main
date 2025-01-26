const API_URL = 'https://returnyoutubedislikeapi.com/votes?videoId=';

// Import requirements
import axios from 'axios';

// Import addons
import { ETError } from '../classes/Error';

// Import types
import { TrackStats } from '../../types';

/**
 * Fetches YouTube video statistics, including likes, dislikes, and views.
 *
 * @callback getVideoStats
 *
 * @param {string} videoId - The ID of the YouTube video.
 *
 * @returns {Promise<TrackStats>} Resolves to an object containing video statistics.
 */
export async function getVideoStats(videoId: string): Promise<TrackStats> {
	const data = {
		views: 0,
		likes: 0,
		dislikes: 0,
		rating: 0,
	};

	try {
		const response = await axios.get(API_URL + videoId);

		data.views = response.data.viewCount;
		data.likes = response.data.likes;
		data.dislikes = response.data.dislikes;
		data.rating = parseFloat(response.data.rating.toFixed(2));
	} catch (e) {
		throw new ETError(e.message);
	}

	return data;
}
