import axios from "axios";
import config from "../config/config"; 

export const fetchUserDataFromAPI = async (userId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/users/${userId}`, {
        headers: config.API_HEADERS,
      });
      return response.data;  
    } catch (error) {
      console.error(`Error fetching user data for userId ${userId}:`, error);
      throw new Error('Failed to fetch user data. Please try again later.');
    }
  };

export const updateUserData = async (setUserData, userId) => {
    try {
      const fetchedData = await fetchUserDataFromAPI(userId);
      setUserData(fetchedData.response);
      localStorage.setItem("userData", JSON.stringify(fetchedData.response));
    } catch (error) {
      console.error("Error updating user data from API:", error);
    }
  };

  export const getProfilePicture = (userData) => {
    // console.log(userData)
    // userData= fetchUserDataFromAPI(userData.userId);
    if (userData?.profilePicBase64) {
      return `data:image/jpeg;base64,${userData.profilePicBase64}`;
    }
    if (userData?.gender === "MALE") {
      return "/assets/images/MaleDefault.jpg";
    } else if (userData?.gender === "FEMALE") {
      return "/assets/images/FemaleDefault.jpg";
    }
    return "/assets/images/default.webp";
  };

  export const getUserData = async(setUserData)=>{
  const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      updateUserData(setUserData,storedData.userId);
      await setUserData(storedData);
    }
    return setUserData;
  };