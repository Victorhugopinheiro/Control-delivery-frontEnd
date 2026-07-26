import axios from 'axios';

// 1. Initialize the instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});





api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {

            console.warn('Unauthorized! Redirecting...');
        }
        return Promise.reject(error);
    }
);

export default api;
