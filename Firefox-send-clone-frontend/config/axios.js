import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.backendURL
});

export default instance;