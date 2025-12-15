// import axios from 'axios';
// import { getTokenFromStore } from '../utils/get-token';

// export const api = axios.create({
//   baseURL: 'https://backend.astrosevaa.com',
//   timeout: 10000,
// });

// api.interceptors.request.use(config => {
//   const token = getTokenFromStore(); // read token from Redux store

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

import axios from 'axios';
import { getTokenFromStore } from '../utils/get-token';

export const api = axios.create({
  baseURL: 'https://backend.astrosevaa.com',
  // baseURL: 'https://severe-aliza-honourably.ngrok-free.dev',
  timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  config => {
    const token = getTokenFromStore();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // only set json content type when request data is plain object
    if (
      config.data &&
      typeof config.data === 'object' &&
      !(config.data instanceof FormData)
    ) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('%cAPI REQUEST', 'color: blue; font-weight: bold;', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  error => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  response => {
    console.log('%cAPI RESPONSE', 'color: green; font-weight: bold;', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  error => {
    console.log('%cAPI ERROR', 'color: red; font-weight: bold;', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  },
);
