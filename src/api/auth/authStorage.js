const AUTH_STORAGE_KEY = 'auth';

export const saveAuth = (auth) => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const getAuth = () => {
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
        return null;
    }

    try {
        return JSON.parse(storedAuth);
    } catch {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
};

export const clearAuth = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
};