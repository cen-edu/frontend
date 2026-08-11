class ApiError extends Error {
    constructor({
        message = '요청을 처리하지 못했습니다.',
        status = null,
        code = null,
        details = null,
        cause = null,
    } = {}) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
        this.cause = cause;
    }
}

export default ApiError;
