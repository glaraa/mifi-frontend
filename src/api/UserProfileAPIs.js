import axios from "axios";
import config from "../config/config"; 


export const updateUserDataDescription = async (userData,updatedUserData) => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/users/${userData.userId}`, {
            method: "PUT",
            headers: config.API_HEADERS,
            body: JSON.stringify(updatedUserData),
        });
        if (response.ok) {
            return await response.json();
        }
    }
    catch (error) {
        console.error(`Error updating user data for userId ${userData.userId}:`, error);
        throw new Error('Failed to update user data. Please try again later.');
    }
};


export const fetchDetailedCreations = async (creation)=>{
    try{
    const detailResponse = await fetch(`${config.API_BASE_URL}/api/users/creations/${creation.creationId}`, {
        method: "GET",
        headers: config.API_HEADERS,
      });
      if (!detailResponse.ok) throw new Error(`Failed to fetch creation details for ${creation.creationId}`);
      return detailResponse.json();
    }
    catch (error) {
        console.error(`Error fetching creation details data for creationId ${creation.creationId}:`, error);
        throw new Error('Failed to update user data. Please try again later.');
    }
};

export const fetchAllCreations = async (userId) => {
    try{
        const response = await fetch(`${config.API_BASE_URL}/api/users/${userId}/creations/all`, {
            method: "GET",
            headers: config.API_HEADERS,
          });
          if (!response.ok)
             throw new Error("Failed to fetch creations.");
         return response.json();
    }
    catch (error) {
        console.error(`Error fetching all creations data for creationId ${userId}:`, error);
        throw new Error('Failed to update user data. Please try again later.');
    }
};

    export const  profilePictureUpload = async (userData,formData,setUserData,onImageUpload)=>{
        try {
            const response = await fetch( `${config.API_BASE_URL}/api/users/profile-pic/${userData.userId}`, {
              method: "POST", headers: config.API_HEADERS_MULTIPART,
              body: formData,
            });
    
            if (response.ok) {
              const result = await response.json();
              setUserData(result.response);
              console.log("Profile picture updated successfully:", result);
    
              onImageUpload(result.profilePicUrl);
            } else {
              console.error("Failed to upload profile picture:", response.statusText);
            }
          } catch (error) {
            console.error("Error uploading profile picture:", error);
          }
    };