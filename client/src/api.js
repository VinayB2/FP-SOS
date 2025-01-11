import axios from 'axios';
// Use the environment variable for the base URL or fallback to localhost
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://fp-sos.onrender.com';

console.log(BASE_URL);

export const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});