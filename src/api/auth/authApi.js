import httpClient from '../httpClient.js';

export const login = ({ loginId, password }) => (
    httpClient.post('/auth/login', {
        loginId,
        password,
    })
);