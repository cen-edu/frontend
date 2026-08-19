import axios from 'axios';
import ApiError from './ApiError';
import { clearAuth, getAuth } from './auth/authStorage.js';

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

const parseBlobResponse = async (responseData) => {
    if (typeof Blob === 'undefined' || !(responseData instanceof Blob)) {
        return responseData;
    }

    try {
        return JSON.parse(await responseData.text());
    } catch {
        return null;
    }
};

httpClient.interceptors.request.use((config) => {
    const auth = getAuth();

    if (auth?.accessToken) {
        config.headers.Authorization =
            `${auth.tokenType || 'Bearer'} ${auth.accessToken}`;
    }

    return config;
});

httpClient.interceptors.response.use(
    (response) => {
        if (response.config.returnRawResponse) {
            return response;
        }

        if (response.status === 204) {
            return null;
        }

        const apiResponse = response.data;

        if (!apiResponse.success) {
            return Promise.reject(new ApiError({
                status: response.status,
                code: apiResponse.error?.code ?? null,
                message: apiResponse.error?.message || '요청을 처리하지 못했습니다.',
            }));
        }

        return apiResponse.data;
    },
    async (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const status = error.response?.status ?? null;
        const responseData = await parseBlobResponse(error.response?.data);
        const errorBody = responseData?.error;
        const isTimeout = error.code === 'ECONNABORTED';

        if (status === 401) {
            clearAuth();

            if (window.location.pathname !== '/') {
                window.location.replace('/');
            }
        }

        return Promise.reject(new ApiError({
            status,
            code: errorBody?.code ?? error.code ?? null,
            message: errorBody?.message
                || (isTimeout
                    ? '요청 시간이 초과되었습니다.'
                    : '요청을 처리하지 못했습니다.'),
            details: responseData?.details ?? null,
            cause: error,
        }));
    },
);

export default httpClient;
