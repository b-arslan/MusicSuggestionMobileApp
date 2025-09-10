import axios from 'axios';

const backendUrl = 'https://spotify-backend-beryl.vercel.app';
const gptBackendUrl = 'https://api.arslanbugra.com/musicsuggestion';

export const fetchRecommendationsFromGPT = async ({
    songs,
    artists,
    mood,
    lessPopular,
}: {
    songs?: string[];
    artists?: string[];
    mood?: string;
    lessPopular: boolean;
}): Promise<{ song: string; artist: string; coverImage: string }[]> => {
    const response = await axios.post(`${gptBackendUrl}/api/v1/recommend`, {
        song: songs,
        artist: artists,
        mood,
        lessPopular,
    });

    return response.data.recommendations;
};

export const fetchArtists = async (
    query: string
): Promise<{ value: string; label: string }[]> => {
    const response = await axios.get(
        `${backendUrl}/api/artists?query=${query}`
    );
    return response.data;
};

export const fetchTracks = async (
    query: string
): Promise<{ value: string; label: string }[]> => {
    const response = await axios.get(
        `${backendUrl}/api/tracks?query=${encodeURIComponent(query)}`
    );
    return response.data;
};

export const fetchRecommendationsByArtistIds = async (
    artistIds: string[],
    popularityRange: { min_popularity: number; max_popularity: number }
): Promise<any[]> => {
    const response = await axios.get(
        `${backendUrl}/api/recommendations/artists?artistIds=${artistIds.join(
            ','
        )}&min_popularity=${popularityRange.min_popularity}&max_popularity=${
            popularityRange.max_popularity
        }`
    );
    return response.data;
};

export const fetchAudioFeaturesForTracks = async (
    trackIds: string[]
): Promise<any[]> => {
    const response = await axios.get(
        `${backendUrl}/api/recommendations/audio-features?trackIds=${trackIds.join(
            ','
        )}`
    );
    return response.data;
};

export const fetchRecommendationsByMood = async (
    mood: keyof MoodToGenresMap
): Promise<any[]> => {
    const response = await axios.get(
        `${backendUrl}/api/recommendations/mood?mood=${mood}`
    );
    return response.data;
};

export const getRecommendationsByAudioFeaturesWithRange = async (
    trackIds: string[],
    popularityRange: { min_popularity: number; max_popularity: number }
): Promise<any[]> => {
    const response = await axios.get(
        `${backendUrl}/api/recommendations/audio-features`,
        {
            params: {
                trackIds: trackIds.join(','),
                min_popularity: popularityRange.min_popularity,
                max_popularity: popularityRange.max_popularity,
            },
        }
    );

    return response.data;
};

export interface MoodToGenresMap {
    chill: string[];
    happy: string[];
    sad: string[];
    sleep: string[];
    party: string[];
    relax: string[];
    romance: string[];
    'rainy-day': string[];
    'work-out': string[];
    study: string[];
}

export const moodToGenres: MoodToGenresMap = {
    chill: ['chill', 'relax', 'ambient'],
    happy: ['dance', 'happy', 'pop'],
    sad: ['sad', 'blues', 'soul'],
    sleep: ['sleep', 'ambient', 'classical'],
    party: ['party', 'dance', 'electronic'],
    relax: ['relax', 'jazz', 'classical'],
    romance: ['romance', 'soul', 'soft-rock'],
    'rainy-day': ['sad', 'acoustic', 'chill'],
    'work-out': ['work-out', 'hip-hop', 'edm'],
    study: ['study', 'chill', 'classical'],
};
