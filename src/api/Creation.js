import api from "./api";
import {fetchUserProfilePic} from "./UserBuddies";

export const uploadCreation = async (formData) => {
    try {
        const response = await api.post(`/api/users/creations`, formData,{
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error during upload:", error);
        throw new Error("Failed to upload the creation");
    }
};

export const fetchComments = async (creationId) => {
    try {
        const response = await api.get(`/api/users/${creationId}/comment`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching creation comments for ${creationId}:`, error);
        throw new Error("Failed to fetch creation comments. Please try again later.");
    }
};

export const uploadComment = async (commentRequest) => {
    try {
        console.log(commentRequest);
        const response = await api.post(`/api/users/comment`, commentRequest);
        console.log("Comment uploaded successfully");
        return response.data;
    } catch (error) {
        console.error("Error uploading comment:", error);
        throw new Error("Failed to upload comment. Please try again later.");
    }
};

export const deleteCreation = async (creationId, userId) => {
    try {
        const response = await api.delete(`/api/users/${userId}/creations/${creationId}`);
        console.log("Creation deleted successfully");
        return response.data;
    } catch (error) {
        console.error("Error deleting creation:", error);
        throw new Error("Failed to delete creation. Please try again later.");
    }
};

export const fetchCreation = async () => {
    try {
        const response = await api.get(`/api/creations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching creation:", error);
        throw new Error("Failed to fetch creation");
    }
};


export const fetchCommentsWithProfilePics = async (creationId) => {
    try {
        const comments = await fetchComments(creationId);
        console.log(comments);
        const commentsWithPictures = await Promise.all(
            comments.response.map(async (comment) => {
                if (!comment.byUser.profilePicBase64) {
                    const profilePicBase64 = await fetchUserProfilePic(comment.byUser.userId);
                    if (profilePicBase64) {
                        comment.byUser.profilePicBase64 = profilePicBase64;
                    }
                }
                return comment;
            })
        );

        return commentsWithPictures;
    } catch (error) {
        console.error("Error processing comments with profile pictures:", error);
        return [];
    }
};