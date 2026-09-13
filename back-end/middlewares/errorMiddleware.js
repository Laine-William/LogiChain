const Logger = require('../utils/logger');

const errorMiddleware = (error, request, response, next) => {

    // 1. Définition du statut (défaut 500)
    const statusCode = error.statusCode || 500;
    
    // 2. Journalisation unique (on combine ou on conditionne le stack)
    // En développement, on peut logguer l'erreur complète, en production juste le message
    if (process.env.NODE_ENV === 'development') {

        const error_message = `[Erreur ${statusCode}] ${error.message}\n${error.stack}`;

        Logger.error(error_message);
    
    } else {

        const error_message = `[Erreur ${statusCode}] ${error.message}`;
    
        Logger.error(error_message);
    
    }

    const error_response = {
        success: false,
        error: error.message || "Une erreur interne est survenue sur le serveur."
    };

    // 3. Réponse formatée
    return response.status(statusCode).json(error_response);
};

module.exports = errorMiddleware;