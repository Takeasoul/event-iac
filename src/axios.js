import axios from 'axios';

const publicRoutes = [
    '/:id/registration-form'
];

// Функция для проверки, является ли маршрут публичным
const isPublicRoute = (url) => {
    return publicRoutes.some(route => {
        const regex = new RegExp(route.replace(/:[^/]+/g, '[^/]+'));
        return regex.test(url);
    });
};

// Интерсептор для включения токенов в запросы
axios.interceptors.request.use(
    (config) => {
        if (!isPublicRoute(config.url)) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
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
        // Если это не публичный маршрут, перенаправляем на страницу входа
        const currentUrl = window.location.pathname;
        if (!isPublicRoute(currentUrl)) {
            window.location.href = '/login';
        }
        return;
    }
    try {
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
        // Если это не публичный маршрут, перенаправляем на страницу входа
        const currentUrl = window.location.pathname;
        if (!isPublicRoute(currentUrl)) {
            window.location.href = '/login';
        }
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

const baseURL = 'https://event-iac.onrender.com';
const instance = axios.create({
    baseURL: baseURL,
});

// Возвращает настроенный экземпляр Axios
export default instance;
