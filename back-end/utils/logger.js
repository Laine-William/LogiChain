class Logger {
    
    info(message) {

        const log = `[INFO] ${new Date().toISOString()}: ${message}`;
    
        console.log(log);
    }

    warn(message) {

        const warn = `[WARN] ${new Date().toISOString()}: ${message}`;
        
        console.warn(warn);
    }

    error(message, error = '') {

        const message_error = `[ERROR] ${new Date().toISOString()}: ${message}`;

        console.error(message_error, error);
    }
}

module.exports = new Logger();