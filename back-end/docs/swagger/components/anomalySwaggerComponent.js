const {anomaly_reasons, anomaly_severities, anomaly_status} = require('../../../../shared_constants/constants');

module.exports = {  
    Anomaly: {
        type: 'object',
        required: ['eventId', 'description', 'severity', 'location'],
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
            reason: { 
                type: 'string', 
                enum: anomaly_reasons,
                example: 'Breakdown'
            },
            description: { 
                type: 'string', 
                example: 'Fuite d\'eau secteur B' 
            },
            severity: { 
                type: 'string', 
                enum: anomaly_severities, 
                example: 'low'
            },
            status: { 
                type: 'string', 
                enum: anomaly_status, 
                default: 'open',
                example: 'open' 
            },
            itemId: {
                type: 'string',
                description: 'ID de l\'item concerné par l\'anomalie',
                example: '6a4cfc028b7d4a94222a950c'
            },
            location: { 
                type: 'object', 
                properties: { 
                    type: { 
                        type: 'string', 
                        default: 'Point' 
                    }, 
                    coordinates: { 
                        type: 'array', 
                        items: { type: 'number' }, 
                        example: [2.3522, 48.8566] 
                    } 
                } 
            },
            isDeleted: { 
                type: 'boolean', 
                default: false,
                example: false  
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
    AnomalyCreate: {
        type: 'object',
        required: ['eventId', 'description', 'severity', 'location'],
        properties: {
            eventId: { 
                type: 'string', 
                description: 'ID de l\'événement associé',
                example: '6a4cfc028b7d4a94222a950c' 
            },
            reason: { 
                type: 'string', 
                enum: anomaly_reasons,
                example: 'Breakdown'
            },
            description: { 
                type: 'string', 
                example: 'Fuite d\'eau secteur B' 
            },
            severity: { 
                type: 'string', 
                enum: anomaly_severities, 
                example: 'low' 
            },
            status: { 
                type: 'string', 
                enum: anomaly_status, 
                example: 'open' 
            },
            itemId: {
                type: 'string',
                description: 'ID de l\'item concerné par l\'anomalie',
                example: '6a4cfc028b7d4a94222a950c'
            },
            location: {
                type: 'object',
                properties: {
                    type: { 
                        type: 'string', 
                        default: 'Point' 
                    },
                    coordinates: { 
                        type: 'array', 
                        items: { type: 'number' }, 
                        example: [2.3522, 48.8566] 
                    }
                }
            }
        }
    },
    AnomalyUpdate: {
        type: 'object',
        properties: {
            eventId: { 
                type: 'string', 
                description: 'ID de l\'événement associé',
                example: '6a4cfc028b7d4a94222a950c' 
            },
            reason: { 
                type: 'string', 
                enum: anomaly_reasons,
                example: 'Breakdown'
            },
            description: { 
                type: 'string', 
                example: 'Fuite d\'eau secteur B' 
            },
            severity: { 
                type: 'string', 
                enum: anomaly_severities, 
                example: 'low' 
            },
            status: { 
                type: 'string', 
                enum: anomaly_status, 
                example: 'open' 
            },
            itemId: {
                type: 'string',
                description: 'ID de l\'item concerné par l\'anomalie',
                example: '6a4cfc028b7d4a94222a950c'
            },
            location: {
                type: 'object',
                properties: {
                    type: { 
                        type: 'string', 
                        default: 'Point' 
                    },
                    coordinates: { 
                        type: 'array', 
                        items: { type: 'number' }, 
                        example: [2.3522, 48.8566] 
                    }
                }
            }
        }
    }
};