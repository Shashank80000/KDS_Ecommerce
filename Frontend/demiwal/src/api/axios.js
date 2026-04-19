import axios from "axios";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const apiBaseUrl = rawApiBaseUrl
    ? (rawApiBaseUrl.endsWith("/api") ? rawApiBaseUrl : `${rawApiBaseUrl.replace(/\/$/, "")}/api`)
    : "/api";

const api = axios.create({
    baseURL : apiBaseUrl
    
})  

export default api;