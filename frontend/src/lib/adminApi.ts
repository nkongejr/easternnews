'use client';

import axios from 'axios';
import { getToken, clearToken } from './auth';

// Same-origin `/api` by default: in dev and preview the Next rewrites in
// next.config.ts proxy those calls to the Express API, which also keeps the
// newsroom dashboard working when it is opened from another device. Production
// sets NEXT_PUBLIC_API_URL to the deployed API.
const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      clearToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default adminApi;