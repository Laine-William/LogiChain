class CustomError extends Error {
    
    constructor(message, statusCode) {
    
        super(message);
    
        this.statusCode = statusCode;
        this.isOperational = true; // Pour différencier des bugs serveurs
    
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;