import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

//Interceptor = like a middleware for requests.
// Before every request is sent, this function runs.
// It checks if localStorage has a saved JWT token.

export default API;