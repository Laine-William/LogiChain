const Joi = require('joi');

const {anomaly_reasons, anomaly_severities, anomaly_status} = require('../shared_constants/constants');

// Schéma de validation pour un point géographique
const pointValidation = Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
});

// Schéma pour la création d'une anomalie (POST)
const anomalySchemaValidation = Joi.object(
    {
        eventId: Joi.string().hex().length(24).required(),
        logisticId: Joi.string().hex().length(24).optional(),
        stepId: Joi.string().hex().length(24).optional(),
        itemId: Joi.string().hex().length(24).optional(),
        reason: Joi.string().valid(...anomaly_reasons).required(),
        description: Joi.string().min(10).optional(),
        severity: Joi.string().valid(...anomaly_severities).default('low'),
        status: Joi.string().valid(...anomaly_status).default('open'),
        location: pointValidation.required()
    }
);

// Schéma pour la mise à jour partielle d'une anomalie (PATCH / PUT)
const anomalyUpdateSchemaValidation = Joi.object(
    {
        eventId: Joi.string().hex().length(24).optional(),
        logisticId: Joi.string().hex().length(24).optional(),
        stepId: Joi.string().hex().length(24).optional(),
        itemId: Joi.string().hex().length(24).optional(),
        reason: Joi.string().valid(...anomaly_reasons).required(),
        description: Joi.string().min(10).optional(),
        severity: Joi.string().valid(...anomaly_severities),
        status: Joi.string().valid(...anomaly_status),
        location: pointValidation.optional()
    }
);

// Schéma pour la mise à jour du statut d'une anomalie
const anomalyStatusSchemaValidation = Joi.object(
    {
        status: Joi.string().valid(...anomaly_status).required()
    }
);

// Schéma pour la mise à jour du statut de la sévérité
const anomalySeveritySchemaValidation = Joi.object(
    {
        severity: Joi.string().valid(...anomaly_severities).required()
    }
);

module.exports = { 
    anomalySchemaValidation, 
    anomalyUpdateSchemaValidation, 
    anomalyStatusSchemaValidation,
    anomalySeveritySchemaValidation 
};