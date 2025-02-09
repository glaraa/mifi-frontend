import api from "./api";

export const checkUsernameAvailability = async (debouncedQuery) => {
  try {
    const response = await api.get(`/api/users/unique/${debouncedQuery}`);
    return response.data.response;
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await api.post(
        `/api/users/register`,
        formData
    );

    return response.data; // Assuming API returns data on success
  } catch (error) {
    console.error("Error during Sign Up:", error);
    throw error.response?.data?.message || "Sign Up Failed"; // Handle errors properly
  }
};

export const fetchUserDataFromAPI = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user data for userId ${userId}:`, error);
    throw new Error("Failed to fetch user data. Please try again later.");
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

export const getUserData = async (setUserData) => {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  if (storedData) {
    await updateUserData(setUserData, storedData.userId);
    await setUserData(storedData);
  }
  return setUserData;
};

export const checkOldPassword = async (userId,oldPassword,newPassword) => {
  try {
    const response = await api.post("/api/update-password",null,
        { params: { userId, oldPassword,newPassword }});
    return response.data;
  } catch (error) {
    return handleApiError(error,"Old password is invalid");
  }
};

export const deleteAccount = async (userId,password,feedback) => {
  try {
    const response = await api.post(`/api/users/${userId}/delete-account`,feedback,
        { params: { password }});
    return response.data;
  } catch (error) {
    return handleApiError(error,"Error deleting account. Please try again later.");

  }
};

export const handleApiError = (error, defaultMessage = "Something went wrong. Please try again.") => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.errors?.[0]?.errorMessage || defaultMessage,
    };
  } else if (error.request) {
    return { success: false, message: "No response from server. Try again later." };
  } else {
    return { success: false, message: defaultMessage };
  }
};




