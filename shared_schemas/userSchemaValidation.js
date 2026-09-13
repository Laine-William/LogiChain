const Joi = require('joi');

const {user_roles, user_accountStatus, user_availabilityStatus} = require('../shared_constants/constants');

// Messages d'erreur personnalisés en français
const customMessages = {
    'string.base': 'Ce champ doit être une chaîne de caractères.',
    'string.empty': 'Ce champ ne peut pas être vide.',
    'string.email': 'Veuillez fournir une adresse e-mail valide.',
    'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères.',
    'string.length': 'Le code de validation doit contenir exactement 6 caractères.',
    'any.required': 'Ce champ est obligatoire.',
    'any.only': 'Valeur non autorisée pour ce champ.'
};

// Schéma pour l'enregistrement d'un utilisateur (POST)
const userRegisterSchemaValidation = Joi.object({
    fullName: Joi.string().required().messages(customMessages),
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(8).required().messages(customMessages),
    role: Joi.string().valid(...user_roles).messages(customMessages),
    accountStatus: Joi.string().valid(...user_accountStatus).messages(customMessages),
    availabilityStatus: Joi.string().valid(...user_availabilityStatus).messages(customMessages)
});

// Schéma pour la connexion d'un utilisateur (POST)
const userLoginSchemaValidation = Joi.object({
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(8).required().messages(customMessages)
});

// Schéma pour la mise à jour du statut pour la disponibilité d'un utilisateur (POST)
const userAvailabilitySchemaValidation = Joi.object({
    availabilityStatus: Joi.string().valid(...user_availabilityStatus).required().messages(customMessages)
});

// Schéma pour la mise à jour du statut pour le compte d'un utilisateur (POST)
const userAccountStatusSchemaValidation = Joi.object({
    accountStatus: Joi.string().valid(...user_accountStatus).required().messages(customMessages)
});

// Schéma pour la demande de mot de passe oublié d'un utilisateur (POST)
const forgotPasswordSchemaValidation = Joi.object({
    email: Joi.string().email().required().messages(customMessages)
});

// Schéma pour la validation d'un code pour réinitialiser le mot de passe d'un utilisateur (POST)
const resetPasswordSchemaValidation = Joi.object({
    email: Joi.string().email().required().messages(customMessages),
    code: Joi.string().length(6).required().messages(customMessages),
    newPassword: Joi.string().min(8).required().messages(customMessages)
});

// Schéma pour la mise à jour partielle d'un utilisateur (PATCH / PUT)
const userUpdateSchemaValidation = Joi.object({
    fullName: Joi.string().optional().messages(customMessages),
    email: Joi.string().email().messages(customMessages),
    password: Joi.string().min(8).messages(customMessages),
    role: Joi.string().valid(...user_roles).messages(customMessages),
    accountStatus: Joi.string().valid(...user_accountStatus).messages(customMessages),
    availabilityStatus: Joi.string().valid(...user_availabilityStatus).messages(customMessages)
});

module.exports = { 
    userRegisterSchemaValidation, 
    userLoginSchemaValidation,
    userUpdateSchemaValidation, 
    userAvailabilitySchemaValidation,
    userAccountStatusSchemaValidation,
    forgotPasswordSchemaValidation,
    resetPasswordSchemaValidation
};