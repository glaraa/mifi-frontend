import api from "./api";

export const fetchUserRequests = async (userId) => {
    try {
        const response = await api.get(`/api/users/requests/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user requests for ${userId}:`, error);
        throw new Error("Failed to fetch user requests. Please try again later.");
    }
};

export const fetchUserBuddies = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/user-buddies`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user buddies for ${userId}:`, error);
        throw new Error("Failed to fetch user buddies. Please try again later.");
    }
};

export const acceptBuddyRequest = async (userId, requesterUserId) => {
    try {
        const response = await api.post(`/api/users/${userId}/add-buddy/${requesterUserId}`);
        return response.data;
    } catch (error) {
        console.error(`Error accepting buddy request for ${userId}:`, error);
        throw new Error("Failed to accept buddy request. Please try again later.");
    }
};

export const addBuddyRequest = async (userId, requesterUserId) => {
    try {
        const response = await api.post(`/api/users/${userId}/buddy-request/${requesterUserId}`);
        return response.data;
    } catch (error) {
        console.error(`Error sending buddy request for ${userId}:`, error);
        throw new Error("Failed to send buddy request. Please try again later.");
    }
};

export const rejectBuddyRequest = async (requestId) => {
    try {
        const response = await api.delete(`/api/users/requests/${requestId}`);
        return response.data;
    } catch (error) {
        console.error(`Error rejecting buddy request for ${requestId}:`, error);
        throw new Error("Failed to reject buddy request. Please try again later.");
    }
};

export const removeBuddy = async (userId, buddyId) => {
    try {
        const response = await api.delete(`/api/users/${userId}/remove-buddy/${buddyId}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing buddy for ${buddyId}:`, error);
        throw new Error("Failed to remove buddy. Please try again later.");
    }
};

export const fetchUserProfilePic = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}`);
        return response.data.response.profilePicBase64;
    } catch (error) {
        console.error(`Error fetching profile picture for user ID ${userId}:`, error);
        return null;
    }
};

export const fetchSuggestedBuddies = async (userId) => {
    try {
        const response = await api.get(`/api/users/suggest-buddies/${userId}`,);

        return response.data.response; // Assuming `response.data.response` holds the suggestions
    } catch (error) {
        console.error("Error fetching buddy suggestions:", error);
        throw new Error("Failed to fetch suggestions");
    }
};

