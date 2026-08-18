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

export const createHandwritingImage = (strokes, { width = 1200, height = 360 } = {}) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineJoin = 'round';

    strokes.forEach((stroke) => {
        if (stroke.points.length < 2) return;
        context.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : '#172033';

        for (let index = 1; index < stroke.points.length; index += 1) {
            const previous = stroke.points[index - 1];
            const current = stroke.points[index];
            context.beginPath();
            context.lineWidth = stroke.tool === 'eraser'
                ? 22
                : 2.2 + (current.pressure || 0.5) * 2.6;
            context.moveTo(previous.x * width, previous.y * height);
            context.lineTo(current.x * width, current.y * height);
            context.stroke();
        }
    });

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('필기 이미지를 만들지 못했습니다.'));
                return;
            }
            resolve(blob);
        }, 'image/png');
    });
};
