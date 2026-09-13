const rateLimit = require('express-rate-limit');

const forgotPasswordMiddleware = rateLimit({
    
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 3, // Limite chaque IP à 3 requêtes par fenêtre pour cette route
    message: {
        message: "Trop de demandes de réinitialisation de mot de passe. Veuillez réessayer dans 15 minutes."
    },
    standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
});

module.exports = forgotPasswordMiddleware;