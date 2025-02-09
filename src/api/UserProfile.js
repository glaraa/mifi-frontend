import api from "./api";
import {handleApiError} from "./Users";

export const updateUserDataDescription = async (updatedUserData) => {
    try {
        const response = await api.put(`/api/users/${updatedUserData.userId}`, updatedUserData);
        return response.data;
    } catch (error) {
        return handleApiError(error, "Failed to update user data.");
    }
};

export const fetchDetailedCreations = async (creationId) => {
    try {
        const response = await api.get(`/api/users/creations/${creationId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, "Failed to fetch detailed creations.");
    }
};

export const fetchAllCreations = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/creations/all`);
        return response.data;
    } catch (error) {
        return handleApiError(error, "Failed to fetch all creations.");
    }
};

export const profilePictureUpload = async (userData, formData, setUserData, onImageUpload) => {
    try {
        const response = await api.post(`/api/users/profile-pic/${userData.userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
            const result = response.data;
            setUserData(result.response);
            onImageUpload(result.profilePicUrl);
        }
    } catch (error) {
        return handleApiError(error, "Failed to update user profile picture.");
    }
};

export const fetchUserRelation = async (userId, viewUserId) => {
    try {
        const response = await api.get(`/api/users/${userId}/view-profile/relation/${viewUserId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, "Failed to fetch user relation .");
    }
};
