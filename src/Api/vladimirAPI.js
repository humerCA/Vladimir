import axios from "axios";

const Base_URL = 'http://10.10.10.4:8000/api/'
// const Base_URL = 'https://6386b780d9b24b1be3dce45b.mockapi.io/todoAPI/'


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
