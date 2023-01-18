import axios from "axios";

const Base_URL = 'http://10.10.10.4:8000/api'


export const usersAPI = axios.create({
    baseURL: Base_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept' : ' application/json'
    }
})

usersAPI.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
