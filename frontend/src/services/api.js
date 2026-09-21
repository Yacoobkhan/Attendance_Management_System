import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {

        const originalRequest = error.config;

        // If access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }


                // Get new access token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );


                const newAccessToken = response.data.access;


                // Store new access token
                localStorage.setItem(
                    "access_token",
                    newAccessToken
                );


                // Add new token to original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                // Retry original request
                return api(originalRequest);

            } catch (refreshError) {

                console.error(
                    "Refresh token failed:",
                    refreshError
                );


                // Remove expired tokens
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");


                // Redirect to login
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default api;