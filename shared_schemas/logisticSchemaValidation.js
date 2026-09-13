const Joi = require('joi');

const {logistic_status, logistic_step_status, logistic_vehicle_types} = require('../shared_constants/constants');

// Schéma GeoJSON standard pour un point géographique
const pointValidation = Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
});

// Schéma pour la création des étapes (POST)
const stepSchemaValidation = Joi.object({
    location: Joi.string().required(),
    position: pointValidation.optional(),
    distance: Joi.number().positive(),
    fuelConsumption: Joi.number().min(0).default(0),
    vehicle: Joi.string().valid(...logistic_vehicle_types).default('truck'),
    status: Joi.string().valid(...logistic_step_status).default('to_do'),
    items: Joi.array().items(Joi.string().hex().length(24)).optional()
});

// Schéma pour la mise à jour partielle (PATCH)
const updateStepSchemaValidation = Joi.object({
    location: Joi.string(),
    position: pointValidation.optional(),
    distance: Joi.number().positive(),
    fuelConsumption: Joi.number().min(0).default(0),
    vehicle: Joi.string().valid(...logistic_vehicle_types).default('truck'),
    status: Joi.string().valid(...logistic_step_status).default('to_do'),
    items: Joi.array().items(Joi.string().hex().length(24)).optional()
});

// Schéma pour la mise à jour du statut
const updateStepStatusSchemaValidation = Joi.object({
    status: Joi.string().valid(...logistic_step_status).required()
});

/// Schéma pour la création de flux logistique avec des étapes (POST)
const logisticSchemaValidation = Joi.object({
    eventId: Joi.string().hex().length(24).optional(),
    userId: Joi.array().items(Joi.string().hex().length(24)).required(),
    departureDestination: Joi.string().required(),
    departurePosition: pointValidation.optional(),
    arrivalDestination: Joi.string().required(),
    arrivalPosition: pointValidation.optional(),
    totalDistance: Joi.number().positive(),
    totalFuelConsumption: Joi.number().min(0).optional(),
    status: Joi.string().valid(...logistic_status).default('starting'),
    steps: Joi.array().items(stepSchemaValidation)
});

// Schéma pour la mise à jour partielle de flux logistique avec des étapes (PATCH)
const updateLogisticSchemaValidation = Joi.object({
    eventId: Joi.string().hex().length(24).optional(),
    userId: Joi.array().items(Joi.string().hex().length(24)).required(),
    departureDestination: Joi.string(),
    departurePosition: pointValidation.optional(),
    arrivalDestination: Joi.string(),
    arrivalPosition: pointValidation.optional(),
    totalDistance: Joi.number().positive(),
    totalFuelConsumption: Joi.number().min(0).optional(),
    steps: Joi.array().items(stepSchemaValidation)
});

// Schéma pour la mise à jour du statut
const updateStatusLogisticSchemaValidation = Joi.object({
    status: Joi.string().valid(...logistic_status).required()
});

module.exports = {
    stepSchemaValidation,
    updateStepSchemaValidation,
    updateStepStatusSchemaValidation,
    logisticSchemaValidation,
    updateLogisticSchemaValidation,
    updateStatusLogisticSchemaValidation,
    logistic_vehicle_types,
    logistic_step_status,
    logistic_status
};