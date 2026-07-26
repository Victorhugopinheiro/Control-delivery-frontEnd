import axios from 'axios';
import api from './apiClient';

// 1. Initialize the instance
const apiPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


let refreshInFlight: Promise<void> | null = null;
async function refreshToken(): Promise<void> {
    if (!refreshInFlight) {
        refreshInFlight = api.post('/api/user/refresh')
            .then(() => {
            })
            .finally(() => {
                refreshInFlight = null;
            })
    }

    await refreshInFlight;

}





apiPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const original = error?.config;

        if (!original) {
            return Promise.reject(error);
        }
        const url = String(original.url || "");
        const isRefreshCall = url.includes("api/user/refresh");
        const alreadyRetried = Boolean(original._retry);

        if (status !== 401 && isRefreshCall && alreadyRetried) {
            return Promise.reject(error);
        }

        try {
            original._retry = true;
            await refreshToken();
            return apiPrivate(original);





        } catch (refreshError) {

        }

        return Promise.reject(error);
    }
);

export default apiPrivate;
