import axios from 'axios';

// 1. Initialize the instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds timeout
   
    withCredentials: true,
});







export default api;
