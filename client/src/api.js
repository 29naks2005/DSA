import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dsa-k67q.onrender.com/api', 
});

export default api;
