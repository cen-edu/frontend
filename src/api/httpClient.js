import axios from 'axios';
import ApiError from './ApiError';
import {getAuth} from "./auth/authStorage.js";

const DEFAULT_API_BASE_URL = '/api';
const DEFAULT_API_TIMEOUT_MS = 10000;

const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
const timeout = Number.isFinite(parsedTimeout) && parsedTimeout > 0
    ? parsedTimeout
    : DEFAULT_API_TIMEOUT_MS;

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
    timeout,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

httpClient.interceptors.request.use((config) => {
    const auth = getAuth();

    if (auth?.accessToken) {
        config.headers.Authorization =
            `${auth.tokenType || 'Bearer'} ${auth.accessToken}`;
    }

    return config;
});

httpClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const responseData = error.response?.data;
        const isTimeout = error.code === 'ECONNABORTED';

        return Promise.reject(new ApiError({
            status: error.response?.status ?? null,
            code: responseData?.code ?? error.code ?? null,
            message: responseData?.message
                || (isTimeout
                    ? '요청 시간이 초과되었습니다.'
                    : '요청을 처리하지 못했습니다.'),
            details: responseData?.details ?? null,
            cause: error,
        }));
    },
);

export default httpClient;
