import httpClient from '../httpClient.js';

export const login = ({ loginId, password }) => (
    httpClient.post('/auth/login', {
        loginId,
        password,
    })
);

export const signup = ({ email, name, password }) => (
    httpClient.post('/auth/signup', {
        email,
        name,
        password,
    })
);