const Joi = require('joi');

const {event_status} = require('../shared_constants/constants');

// Schéma de validation pour une zone géographique de type Polygone GeoJSON
const zoneValidation = Joi.object({
    zone: Joi.object({
        type: Joi.string().valid('Polygon').required(),
        coordinates: Joi.array().items(
            Joi.array().items(
                Joi.array().items(Joi.number())
            )
        ).required()
    }).required(),
    status: Joi.string().optional()
});

// Schéma pour la création d'un événement (POST)
const eventSchemaValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    zones: Joi.array().items(zoneValidation).required(),
    status: Joi.string().valid(...event_status).default('active')
});

// Schéma pour la mise à jour partielle d'un événement (PATCH / PUT)
const eventUpdateSchemaValidation = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    zones: Joi.array().items(zoneValidation).optional(),
    status: Joi.string().valid(...event_status).optional()
});

// Schéma pour la mise à jour spécifique du statut d'un événement
const eventStatusSchemaValidation = Joi.object({
    status: Joi.string().valid(...event_status).required()
});

module.exports = { 
    eventSchemaValidation, 
    eventUpdateSchemaValidation, 
    eventStatusSchemaValidation 
};