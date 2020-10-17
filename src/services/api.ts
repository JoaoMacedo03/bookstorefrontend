import axios from 'axios';

const jwt = localStorage.getItem('@BookStore:token');

const api = axios.create({
  baseURL: 'http://localhost:3333/api/v1/',
  headers: {
    Authorization: `bearer ${jwt}`,
  }
});

export default api;
