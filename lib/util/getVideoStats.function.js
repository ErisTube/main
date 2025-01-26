"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoStats = getVideoStats;
const API_URL = 'https://returnyoutubedislikeapi.com/votes?videoId=';
// Import requirements
const axios_1 = __importDefault(require("axios"));
// Import addons
const Error_1 = require("../classes/Error");
/**
 * Fetches YouTube video statistics, including likes, dislikes, and views.
 *
 * @callback getVideoStats
 *
 * @param {string} videoId - The ID of the YouTube video.
 *
 * @returns {Promise<TrackStats>} Resolves to an object containing video statistics.
 */
async function getVideoStats(videoId) {
    const data = {
        views: 0,
        likes: 0,
        dislikes: 0,
        rating: 0,
    };
    try {
        const response = await axios_1.default.get(API_URL + videoId);
        data.views = response.data.viewCount;
        data.likes = response.data.likes;
        data.dislikes = response.data.dislikes;
        data.rating = parseFloat(response.data.rating.toFixed(2));
    }
    catch (e) {
        throw new Error_1.ETError(e.message);
    }
    return data;
}
