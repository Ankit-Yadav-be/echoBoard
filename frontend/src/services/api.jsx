import axios from 'axios';

const API = axios.create({
  baseURL: 'https://echoboard.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); // ✅ Fix here
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
