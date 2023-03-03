import axios from "axios";

const Base_URL = 'http://127.0.0.1:8000/api'
// const Base_URL = 'http://10.10.8.26:8000/api/'


export const vladimirAPI = axios.create({
    baseURL: Base_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept' : ' application/json'
    }
})

vladimirAPI.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
