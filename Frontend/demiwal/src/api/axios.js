import axios from "axios";

const isDevelopment = import.meta.env.DEV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!isDevelopment && !apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required in production and must point to your deployed backend, for example https://your-backend-domain/api");
}

const api = axios.create({
    baseURL : apiBaseUrl || "http://localhost:5001/api"
    
})  

export default api;