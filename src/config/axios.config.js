import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const instance = axios.create({
  baseURL: `http://192.168.121.223:3055/v1/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


instance.interceptors.request.use(
  async function (config) {
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/verify-otp', 
      '/user/request-reset-password', '/user/verify-reset-password', '/user/reset-password'];
    const isPublicRequest = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    
    if (!isPublicRequest) { 
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log('Access Token:', accessToken);
      if (accessToken) {
        config.headers['authorization'] = accessToken;
      }
    }

    return config;
  },
  function (err) {
    console.log('Request Error:', err);
    return Promise.reject(err);
  }
);


instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['authorization'] = token;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const clientId = await AsyncStorage.getItem('client_id');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        const refreshResponse = await instance.post(
          '/auth/refresh-token',
          {},
          {
            headers: {
              'x-client-id': clientId,
              'refresh-token': refreshToken,
            },
          }
        );

        const newAccessToken = refreshResponse.data.metadata.tokens.accessToken;
        const newRefreshToken = refreshResponse.data.metadata.tokens.refreshToken;

        await AsyncStorage.setItem('access_token', newAccessToken);
        await AsyncStorage.setItem('refresh_token', newRefreshToken);
        processQueue(null, newAccessToken);
        processQueue(null, newRefreshToken);
        originalRequest.headers['authorization'] = newAccessToken;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
