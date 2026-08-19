import httpClient from '../httpClient.js';

export const getStudentAccount = ({ signal } = {}) => (
    httpClient.get('/student/account', { signal })
);

export const changeStudentPassword = ({
    currentPassword,
    newPassword,
    newPasswordConfirm,
}) => (
    httpClient.patch('/student/account/password', {
        currentPassword,
        newPassword,
        newPasswordConfirm,
    })
);
