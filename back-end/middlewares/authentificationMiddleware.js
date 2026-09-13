const jwt = require('jsonwebtoken');

const Logger = require('../utils/logger');

const authentificationMiddleware = (request, response, next) => {

    let token = null;

    if (request.cookies && request.cookies.token) {
        
        token = request.cookies.token;
    }

    if (!token) {
        
        const log = `Tentative d'accès non autorisée sur ${request.originalUrl} : Token manquant dans les cookies`;
        
        Logger.warn(log);
        
        const error_message = "Accès refusé. Token manquant.";

        return response.status(401).json({ 
            message: error_message 
        });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userId = decoded.id;

        request.user = {
            ...decoded,
            id: userId
        };
        
        const log = `Accès autorisé pour l'utilisateur ${userId} sur ${request.originalUrl}`;

        Logger.info(log);
        
        next();
        
    } catch (error) {
        
        const log = `Token invalide ou expiré sur ${request.originalUrl} : ${error.message}`;

        Logger.error(log);
        
        const message = "Session expirée ou invalide. Veuillez vous reconnecter.";

        return response.status(401).json({ 
            message: message 
        });
    }
};

module.exports = authentificationMiddleware;