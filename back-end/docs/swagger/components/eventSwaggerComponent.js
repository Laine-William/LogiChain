const {event_status} = require('../../../../shared_constants/constants');

// Coordonnées Polygonale réutilisable
const ZoneDefinition = {
    type: 'object',
    required: ['zone'],
    properties: {
        _id: { 
            type: 'string', 
            example: '6a4cfc028b7d4a94222a950c' 
        },
        zone: { 
            type: 'object',
            required: ['type', 'coordinates'],
            properties: {
                type: { 
                    type: 'string', 
                    enum: ['Polygon'], 
                    default: 'Polygon',
                    example: 'Polygon' 
                },
                coordinates: { 
                    type: 'array', 
                    items: {
                        type: 'array',
                        items: {
                            type: 'array',
                            items: { type: 'number' }
                        }
                    }, 
                    example: [[[2.15, 48.8], [2.25, 48.8], [2.25, 48.9], [2.15, 48.9], [2.15, 48.8]]] 
                }
            },
            description: 'Zone géographique délimitée en polygone (GeoJSON)'
        },
        status: { 
            type: 'string', 
            default: 'active',
            example: 'active' 
        }
    }
};

module.exports = {
    Event: {
        type: 'object',
        required: ['name', 'zone'],
        properties: {
            _id: { 
                type: 'string', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            name: { 
                type: 'string', 
                example: 'Maintenance préventive' 
            },
            description: { 
                type: 'string', 
                example: 'Configuration globale de l’événement et des périmètres logistiques' 
            },
            startDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-29T00:00:00.000Z' 
            },
            endDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-31T23:59:59.000Z' 
            },
            zones: {
                type: 'array',
                items: ZoneDefinition,
                description: 'Tableau des zones géospatiales de l\'événement'
            },
            status: { 
                type: 'string', 
                enum: event_status, 
                default: 'active',
                example: 'active' 
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
    EventCreate: {
        type: 'object',
        required: ['name', 'zones'],
        properties: {
            name: { 
                type: 'string', 
                example: 'Festival LogiChain 2026' 
            },
            description: { 
                type: 'string', 
                example: 'Configuration globale de l’événement et des périmètres logistiques' 
            },
            startDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-29T00:00:00.000Z' 
            },
            endDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-31T23:59:59.000Z' 
            },
            zones: {
                type: 'array',
                items: ZoneDefinition,
                description: 'Tableau des zones géospatiales de l\'événement'
            },
            status: { 
                type: 'string', 
                enum: event_status, 
                default: 'active',
                example: 'active' 
            }
        }
    },
    EventUpdate: {
        type: 'object',
        properties: {
            name: { 
                type: 'string', 
                example: 'Festival LogiChain 2026' 
            },
            description: { 
                type: 'string', 
                example: 'Configuration globale de l’événement et des périmètres logistiques' 
            },
            startDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-29T00:00:00.000Z' 
            },
            endDate: { 
                type: 'string', 
                format: 'date-time',
                example: '2026-08-31T23:59:59.000Z' 
            },
            zones: {
                type: 'array',
                items: ZoneDefinition,
                description: 'Tableau des zones géospatiales de l\'événement'
            },
            status: { 
                type: 'string', 
                enum: event_status, 
                default: 'active',
                example: 'active' 
            }
        }
    },
    EventStatistic: {
        type: 'object',
        properties: {
            zone: {
                type: 'string',
                description: 'Nom de la zone géographique',
                example: 'Zone industrielle Nord'
            },
            totalEvents: {
                type: 'integer',
                description: 'Nombre total d\'événements actifs',
                example: 5
            }
        }
    }
};