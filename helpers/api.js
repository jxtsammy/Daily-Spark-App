import axios from 'axios';

// Configure base URL (replace with your API endpoint)
const api = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 50000, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Optional: Add request/response interceptors
api.interceptors.request.use(
  (config) => {
    // Modify requests before sending (e.g., add auth token)
    const token = 'YOUR_AUTH_TOKEN'; // Retrieve from AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      console.log('Unauthorized! Redirect to login.');
    }
    return Promise.reject(error);
  },
);

export default api;