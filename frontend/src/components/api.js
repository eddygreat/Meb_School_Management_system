import axios from 'axios';

// Create an Axios instance with a base URL.
// In a real app, this would come from an environment variable.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use Vite's env variables
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle common responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401 Unauthorized, 403 Forbidden, etc.
    if (error.response && error.response.status === 401) {
      // For example, log out the user and redirect to login
      console.error("Unauthorized! Logging out.");
      // You might call a logout function here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;