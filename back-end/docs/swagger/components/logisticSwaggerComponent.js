const {logistic_status, logistic_step_status, logistic_vehicle_types } = require('../../../../shared_constants/constants');

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
    Logistic: {
        type: 'object',
        required: ['departureDestination', 'arrivalDestination'],
        properties: {
            _id: { 
                type: 'string', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            eventId: { 
                type: 'string', 
                description: 'ID de l\'événement associé',
                example: '6a4cfc028b7d4a94222a950c' 
            },
            departureDestination: { 
                type: 'string', 
                example: 'Le Havre' 
            },
            departurePosition: GeoJsonPoint,
            arrivalDestination: { 
                type: 'string', 
                example: 'Paris' 
            },
            arrivalPosition: GeoJsonPoint,
            status: {
                type: 'string',
                enum: logistic_status,
                default: 'starting',
                example: 'starting'
            },
            totalDistance: { 
                type: 'number', 
                example: 200.5 
            },
            totalFuelConsumption: {
                type: 'number', 
                example: 120.5
            },
            statusHistory: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', 
                            example: 'in_preparation' 
                        },
                        changedAt: { 
                            type: 'string', 
                            format: 'date-time' 
                        },
                        userId: { 
                            type: 'array',
                            items: {
                                type: 'string', 
                                example: '6a4cfc028b7d4a94222a950c'
                            },
                            description: 'ID des utilisateurs assignés'
                        }
                    }
                }
            },
            isDeleted: { 
                type: 'boolean', 
                default: false,
                example: false 
            },
            steps: {
                type: 'array',
                items: {
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
                        createdAt: { 
                            type: 'string', 
                            format: 'date-time' 
                        },
                        updatedAt: { 
                            type: 'string', 
                            format: 'date-time' 
                        },
                        status: { 
                            type: 'string', 
                            enum: ['to_do', 'in_progress', 'completed', 'blocked', 'delayed', 'cancelled'],
                            default: 'to_do',
                            example: 'to_do' 
                        },
                        isDeleted: { 
                            type: 'boolean', 
                            default: false,
                            example: false 
                        }
                    }
                }
            },
            createdAt: { 
                type: 'string', 
                format: 'date-time' 
            },
            updatedAt: { 
                type: 'string', 
                format: 'date-time' 
            }
        }
    },
    LogisticCreate: {
        type: 'object',
        required: ['departureDestination', 'arrivalDestination'],
        properties: {
            eventId: { 
                type: 'string', 
                description: 'ID de l\'événement associé',
                example: '6a4cfc028b7d4a94222a950c' 
            },
            departureDestination: { 
                type: 'string', 
                example: 'Le Havre' 
            },
            departurePosition: GeoJsonPoint,
            arrivalDestination: { 
                type: 'string', 
                example: 'Paris' 
            },
            arrivalPosition: GeoJsonPoint,
            status: { 
                type: 'string', 
                enum: logistic_status,
                default: 'starting',
                example: 'starting'
            },
            userId: { 
                type: 'array',
                items: {
                    type: 'string', 
                    example: '6a4cfc028b7d4a94222a950c'
                },
                description: 'IDs des utilisateurs assignés'
            },
            totalDistance: { 
                type: 'number', 
                example: 200.5 
            },
            totalFuelConsumption: { 
                type: 'number', 
                example: 120.5 
            },
            steps: {
                type: 'array',
                items: {
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
                        }
                    }
                }
            }
        }
    },
    LogisticUpdate: {
        type: 'object',
        properties: {
            eventId: { 
                type: 'string', 
                description: 'ID de l\'événement associé',
                example: '6a4cfc028b7d4a94222a950c' 
            },
            departureDestination: { 
                type: 'string', 
                example: 'Le Havre' 
            },
            departurePosition: GeoJsonPoint,
            arrivalDestination: { 
                type: 'string', 
                example: 'Paris' 
            },
            arrivalPosition: GeoJsonPoint,
            status: { 
                type: 'string', 
                enum: logistic_status,
                default: 'starting',
                example: 'starting' 
            },
            userId: { 
                type: 'array',
                items: {
                    type: 'string', 
                    example: '6a4cfc028b7d4a94222a950c'
                },
                description: 'ID des utilisateurs assignés'
            },
            totalDistance: { 
                type: 'number', 
                example: 200.5 
            },
            totalFuelConsumption: { 
                type: 'number', 
                example: 120.5 
            },
            steps: {
                type: 'array',
                    items: {
                    type: 'object',
                    properties: {
                        location: { 
                            type: 'string', 
                            example: 'Rouen' 
                        },
                        position: GeoJsonPoint,
                        distance: { 
                            type: 'number', 
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
                        }
                    }
                }
            }
        }
    }
};