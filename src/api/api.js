import axios from "axios";
import config from "../config/config";

const api = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "RequestBy": "MIFI_FRONTEND"
    },
});

api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("authToken");

        if (token) {
            token = token.replace(/^"(.*)"$/, "$1");
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (loginData, navigate, setErrorMessage) => {
    try {
        const response = await api.post("/api/login", loginData);
        const data = response.data;

        if (response.status === 200 && data.response) {
            const userData = JSON.stringify(data.response);
            const token =  JSON.stringify(data.response.token);
            localStorage.setItem("userData", userData);
            localStorage.setItem("authToken", token);
            api.defaults.headers.Authorization = `Bearer ${token}`;
            navigate("/user-profile");
        }
    } catch (error) {
        console.error("Login error:", error);
        setErrorMessage( error.response.data?.errors?.[0]?.errorMessage || "Something went wrong");
    }
};

export default api;
