// src/axios.js
import axios from 'axios';

// Интерсептор для включения токенов в запросы
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Функция для обновления access токенов
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        // Перенаправление на страницу входа или обработка ошибки
        window.location.href = '/login';
        return;
    }
    try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
        // Перенаправление на страницу входа или обработка ошибки
        window.location.href = '/login';
    }
};

// Интерсептор для перехвата ошибок и повторных попыток запросов
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshAccessToken();
            const newToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axios;
