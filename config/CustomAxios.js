import axios from 'axios';
import {  JWT_TOKEN } from '@env';

const customAxios = axios.create({
  baseURL: 'http://10.0.2.2:8080',
});

console.log("JWTTOKEN in CustomAxios=====>",JWT_TOKEN);

// Request interceptor
customAxios.interceptors.request.use(
  (config) => {
    // Add token to request headers
    config.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxios;