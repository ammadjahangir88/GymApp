// axios.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://gym.vteamslabs.com/api', // Replace with your base URL
  // other global settings
});
  
// Request Interceptor
axiosInstance.interceptors.request.use(
  async config => {
    // Add authorization token to headers or other configurations
    const token = await AsyncStorage.getItem('token');
    if (token) { 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors
    if (error.response && error.response.status === 401) {
      // Handle 401 errors, e.g., redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;