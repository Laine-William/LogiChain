const CustomError = require('../utils/customError');

class BaseService {

    _isAdmin(requestUser) {

        const IsAdmin = ['admin', 'superadmin'].includes(requestUser.role);

        return IsAdmin;
    }

    _checkAccountStatus(requestUser) {

        const restrictedStatus = {
            'suspended': 'Ce compte est suspendu. Aucune action autorisée.',
            'pending': 'Ce compte est en attente de validation.'
        };

        const error_message = restrictedStatus[requestUser.accountStatus];
        
        if (error_message) {

            throw new CustomError(error_message, 403);
        }
    }

    _checkAdminAccess(requestUser) {

        this._checkAccountStatus(requestUser);

        const IsAccess = ['admin', 'superadmin'].includes(requestUser.role);

        if (!IsAccess) {

            const error_message = `Accès réservé aux administrateurs.`;

            throw new CustomError(error_message, 403);
        }
    }

    _checkUserSecurity(resource, requestUser) {
       
        this._checkAccountStatus(requestUser);

        if (resource) {

            const isAdmin = this._isAdmin(requestUser);

            const isSelfUser = !Array.isArray(resource) && 
                               (String(resource.id || resource._id) === String(requestUser.id));

            // Fonction utilitaire pour valider si l'utilisateur fait partie de userId (tableau ou valeur unique)
            const hasUserAccess = (userIdField) => {
                if (!userIdField) return false;
                if (Array.isArray(userIdField)) {
                    return userIdField.some(id => String(id) === String(requestUser.id));
                }
                return String(userIdField) === String(requestUser.id);
            };

            const isObjectOwner = !Array.isArray(resource) && hasUserAccess(resource.userId);
            
            const isListOwner = Array.isArray(resource) && 
                                resource.length > 0 &&
                                resource.every(item => hasUserAccess(item.userId));

            if (!isAdmin && !isSelfUser && !isObjectOwner && !isListOwner) {

                const error_message = `Accès interdit à cette ressource.`;

                throw new CustomError(error_message, 403);
            }
        }
    }

    // --- Validation des données (400) ---
    _validateBadRequest(condition, message) {

        if (condition) {
        
            throw new CustomError(message, 400);
        }
    }

    // --- Validation des conflits (409) ---
    _validateConflict(condition, message) {
        
        if (condition) {
        
            throw new CustomError(message, 409);
        }
    }

    // --- Validation d'existence (404) ---
    _validateNotFound(condition, message) {
        
        if (condition) {
        
            throw new CustomError(message, 404);
        }
    }
}

module.exports = BaseService;