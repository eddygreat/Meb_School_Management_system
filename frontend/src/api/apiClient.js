import axios from 'axios';

// Create a central axios instance with a configured base URL.
// The baseURL is read from your environment variables, which allows you to
// easily switch between local and production backend URLs.
const apiClient = axios.create({
  baseURL: '/api',
});

// You can also add interceptors here for handling tokens, errors, etc.

export default apiClient;