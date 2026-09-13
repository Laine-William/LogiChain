const mongoose = require('mongoose');
const Logger = require('../utils/logger');

const validationMiddleware = (schema = null, validateObjectId = false) => {

    return (request, response, next) => {

        const id = request.params.id;

        if (validateObjectId && id) {
            
            if (!mongoose.Types.ObjectId.isValid(id)) {

                const errorResponse = response.status(400).json({
                    success: false,
                    error: "Le format de l'identifiant est invalide"
                });
            
                return errorResponse;
            }
        }

        const isReadOperation = ['GET', 'DELETE'].includes(request.method);
       
        const isEmptyBody = !request.body || Object.keys(request.body).length === 0;

        if (isReadOperation || isEmptyBody) {
       
            return next();
        }

        // Sinon, on valide les données
        const { error } = schema.validate(request.body, { abortEarly: false });
        
        if (error) {
            
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            
            const log = `Validation échouée sur ${request.originalUrl}: ${errorMessage}`;
    
            Logger.info(log);

            const errorResponse = {
                success: false,
                error: errorMessage
            };

            const statusResponse = response.status(400).json(errorResponse);

            return statusResponse;
        }
        
        next();
    };
};

module.exports = validationMiddleware;