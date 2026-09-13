const Joi = require('joi');

const {notification_types} = require('../shared_constants/constants');

const notificationTypeSchemaValidation = Joi.object({
    type: Joi.string().valid(...notification_types).required().messages({
                                                                                        'any.required': 'Le type est obligatoire',
                                                                                        'any.only': 'Le type doit être system, alert, info ou warning'
                                                                                    })
});

// Schéma complet pour la création ou la validation globale d'une notification
const notificationSchemaValidation = Joi.object({
    userId: Joi.string().hex().length(24).required().messages({
                                                                'string.length': 'L\'ID utilisateur doit comporter 24 caractères hexadécimaux'
                                                            }),
    message: Joi.string().min(3).max(150).required(),
    type: Joi.string().valid(...notification_types).default('system'),
    isRead: Joi.boolean().default(false),
    externalRef: Joi.string().optional()
});

module.exports = { 
    notificationSchemaValidation, 
    notificationTypeSchemaValidation 
};