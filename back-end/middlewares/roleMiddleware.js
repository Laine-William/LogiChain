const roleMiddleware = (requiredRoles = []) => {

    return (request, response, next) => {

        if (!request.user) {

            const error_message = `Utilisateur non connecté.`;

            return response.status(401).json({ message: error_message });
        }

        if (!requiredRoles.includes(request.user.role)) {

            const error_message = `Accès refusé. Vous n'avez pas les permissions nécessaires.`;

            return response.status(403).json({ 
                message: error_message
            });
        }

        next();
    };
};

module.exports = roleMiddleware;