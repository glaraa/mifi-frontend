import api from "./api";

export const forgotPassword = async (email, username) => {
    return api.post(`/api/forgot-password`, null, {
        params: { email, username }
    });

};

export const validateOtp = async (email, otp) => {
    return await api.post(`/api/validate-otp`,null, {
        params: { email, otp }
    });
};

export const resetPassword = async (email, password) => {
    return await api.post(`/api/reset-password`,null, {
        params: { email, password }
    });
};