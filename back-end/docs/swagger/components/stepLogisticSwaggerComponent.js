const {logistic_step_status, logistic_vehicle_types} = require('../../../../shared_constants/constants');

// Coordonnées GeoJSON réutilisable
const GeoJsonPoint = {
    type: 'object',
    properties: {
        type: { 
            type: 'string', 
            example: 'Point' 
        },
        coordinates: { 
            type: 'array', 
            items: { type: 'number' },
            example: [2.3522, 48.8566] 
        }
    }
};

module.exports = {
    StepLogistic: {
        type: 'object',
        required: ['location', 'distance', 'vehicle'],
        properties: {
            location: { 
                type: 'string', 
                example: 'Rouen' 
            },
            position: GeoJsonPoint,
            distance: { 
                type: 'number', 
                default: 50.0,
                example: 50.0 
            },
            vehicle: { 
                type: 'string', 
                enum: logistic_vehicle_types,
                default: 'truck',
                example: 'truck'  
            },
            status: { 
                type: 'string', 
                enum: logistic_step_status,
                default: 'to_do',
                example: 'to_do' 
            },
            items: {
                type: 'array',
                items: {
                    type: 'string',
                    example: '6a4cfc028b7d4a94222a950c'
                },
                description: 'IDs des items rattachés à cette étape',
                example: ['6a4cfc028b7d4a94222a950c']
            },
            statusHistory: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        status: { 
                            type: 'string', 
                            example: 'to_do' 
                        },
                        changedAt: { 
                            type: 'string', 
                            format: 'date-time' 
                        },
                        userId: { 
                            type: 'string', 
                            example: '6a4cfc028b7d4a94222a950c' 
                        }
                    }
                }
            },
            isDeleted: { 
                type: 'boolean', 
                default: false,
                example: false 
            }
        }
    },
    StepLogisticCreate: {
        type: 'object',
        required: ['location', 'distance', 'vehicle'],
        properties: {
            location: { 
                type: 'string', 
                example: 'Rouen' 
            },
            position: GeoJsonPoint,
            distance: { 
                type: 'number', 
                default: 50.0,
                example: 50.0 
            },
            vehicle: { 
                type: 'string', 
                enum: logistic_vehicle_types,
                default: 'truck',
                example: 'truck'  
            },
            status: { 
                type: 'string', 
                enum: logistic_step_status,
                default: 'to_do',
                example: 'to_do' 
            },
            items: {
                type: 'array',
                items: {
                    type: 'string',
                    example: '6a4cfc028b7d4a94222a950c'
                },
                description: 'IDs des items rattachés à cette étape',
                example: ['6a4cfc028b7d4a94222a950c']
            }
        }
    },
    StepLogisticUpdate: {
        type: 'object',
        properties: {
            location: { 
                type: 'string', 
                example: 'Rouen' 
            },
            position: GeoJsonPoint,
            distance: { 
                type: 'number', 
                default: 50.0,
                example: 50.0 
            },
            vehicle: { 
                type: 'string', 
                enum: logistic_vehicle_types,
                default: 'truck',
                example: 'truck'  
            },
            status: { 
                type: 'string', 
                enum: logistic_step_status,
                example: 'to_do' 
            },
            items: {
                type: 'array',
                items: {
                    type: 'string',
                    example: '6a4cfc028b7d4a94222a950c'
                },
                description: 'IDs des items rattachés à cette étape',
                example: ['6a4cfc028b7d4a94222a950c']
            },
            isDeleted: { 
                type: 'boolean', 
                example: false 
            }
        }
    }
};