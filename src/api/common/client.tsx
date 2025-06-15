import { Env } from '@env';
import axios from 'axios';

import { getToken } from '@/lib/auth/utils';

export const client = axios.create({
  baseURL: Env.API_URL,
});

// Add a request interceptor to automatically add the token to all requests
client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors here if you want to implement token refresh
    // For now, just log and reject the error
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access, token might be expired');
      // You could implement token refresh logic here
    }
    return Promise.reject(error);
  }
);
