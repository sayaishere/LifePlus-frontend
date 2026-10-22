import axios from 'axios';

// Create an Axios instance pointing to your local backend server
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to requests if user is logged in
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth endpoints
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);

// Donor & Request endpoints
export const fetchDonors = (filters) => API.get('/donors', { params: filters });
export const createBloodRequest = (requestData) => API.post('/requests', requestData);
export const fetchBloodRequests = () => API.get('/requests');

// User Profile endpoints
export const getUserProfile = (id) => API.get('/auth/profile/' + id);
export const updateUserProfile = (id, data) => API.put('/auth/profile/' + id, data);

// Aliases
export const getBloodRequests = fetchBloodRequests;

export default API;