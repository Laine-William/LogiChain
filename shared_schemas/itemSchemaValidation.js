const Joi = require('joi');

const {item_types, item_status} = require('../shared_constants/constants');

const itemSchemaValidation = Joi.object(
    {
        name: Joi.string().required(),
        type: Joi.string().valid(...item_types).required(),
        details: Joi.object().unknown(true),
        quantity: Joi.number().integer().min(1),
        status: Joi.string().valid(...item_status).default('available')
    }
);

const itemUpdateSchemaValidation = Joi.object(
    {
        name: Joi.string(),
        type: Joi.string().valid(...item_types),
        details: Joi.object().unknown(true),
        quantity: Joi.number().integer().min(1),
        status: Joi.string().valid(...item_status)
    }
);

const itemStatusSchemaValidation = Joi.object(
    {
        status: Joi.string().valid(...item_status).required()
    }
);

module.exports = { 
    itemSchemaValidation, 
    itemUpdateSchemaValidation, 
    itemStatusSchemaValidation 
};