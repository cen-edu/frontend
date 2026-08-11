const DATABASE_NAME = 'student-handwriting-answers';
const STORE_NAME = 'answers';
const DATABASE_VERSION = 1;

const openDatabase = () => new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

export const loadHandwriting = async (key) => {
    if (!window.indexedDB) return [];
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(key);
        request.onsuccess = () => resolve(request.result?.strokes ?? []);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
    });
};

export const saveHandwriting = async (key, strokes) => {
    if (!window.indexedDB) return;
    const database = await openDatabase();

    await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put({ key, strokes, updatedAt: new Date().toISOString() });
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
    });

    database.close();
};

