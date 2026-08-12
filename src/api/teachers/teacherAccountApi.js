import httpClient from '../httpClient.js';

export const getTeacherAccount = ({ signal } = {}) => (
    httpClient.get('/teacher/account', { signal })
);

export const changeTeacherPassword = ({
    currentPassword,
    newPassword,
    newPasswordConfirm,
}) => (
    httpClient.patch('/teacher/account/password', {
        currentPassword,
        newPassword,
        newPasswordConfirm,
    })
);

export const deleteTeacherAccount = () => (
    httpClient.delete('/teacher/account')
);
