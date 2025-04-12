import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/users', // matches your route base
  withCredentials: false, // only set to true if using cookies/session
});

export default api;
