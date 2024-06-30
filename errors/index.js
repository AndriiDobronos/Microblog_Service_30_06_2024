class ValidationError extends Error {
    constructor({ msg = 'Validation failed', errors }) {
        super(msg);

        this.status = 400;
        this.errors = errors;
    }
}

class AuthError extends Error {
    constructor({ msg = 'Authentication failed', errors }) {
        super(msg);

        this.status = 401;
        this.errors = errors;
    }
}

class NotFoundError extends Error {
    constructor({ msg = 'Resource not found', errors }) {
        super(msg);

        this.errors = errors;
        this.status = 404;
    }
}

module.exports = {
    ValidationError,
    AuthError,
    NotFoundError
};