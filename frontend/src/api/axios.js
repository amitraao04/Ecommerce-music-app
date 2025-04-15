import axios from 'axios';

const api = axios.create({
  baseURL: 'https://music-backend-xq0r.onrender.com/api/users', // matches your route base
  withCredentials: false, // only set to true if using cookies/session
});

export default api;
