import api from "./api";

export const userFeedCreations = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/creations/feed`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user feed for ${userId}:`, error);
        throw new Error("Failed to fetch user feed. Please try again later.");
    }
};
