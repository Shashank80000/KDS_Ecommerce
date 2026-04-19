import axios from "axios";

const isDevelopment = import.meta.env.DEV;

const api = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL || (isDevelopment ? "http://localhost:5001/api" : "/api")
    
})  

export default api;