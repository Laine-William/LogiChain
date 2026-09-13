const {item_status, item_types} = require('../../../../shared_constants/constants');

module.exports = {
    Item: {
        type: 'object',
        required: ['name', 'type', 'details'],
        properties: {
            _id: { 
                type: 'string', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            name: { 
                type: 'string', 
                example: 'Camion frigorifique' 
            },
            type: { 
                type: 'string', 
                enum: item_types, 
                default: 'sonorisation',
                example: 'sonorisation'
            },
            details: { 
                type: 'object', 
                description: 'Informations supplémentaires (données spécifiques selon le type d\'équipement)',
                example: { 
                'marque': 'JBL', 
                'annee': 2024, 
                'poids': '0,150 Kg',
                'decibels': 120
                }
            },
            quantity: {
                type: 'number',
                default: 1,
                minimum: 0,
                example: 5
            },
            status: { 
                type: 'string', 
                enum: item_status,
                default: 'available', 
                example: 'available' 
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
    ItemCreate: {
        type: 'object',
        required: ['name', 'type', 'details'],
        properties: {
            name: { 
                type: 'string', 
                example: 'Camion frigorifique' 
            },
            type: { 
                type: 'string', 
                enum: item_types, 
                default: 'sonorisation',
                example: 'sonorisation'
            },
            details: { 
                type: 'object', 
                description: 'Informations supplémentaires (données spécifiques selon le type d\'équipement)',
                example: { 
                'marque': 'JBL', 
                'annee': 2024, 
                'poids': '0,150 Kg',
                'decibels': 120
                }
            },
            quantity: {
                type: 'number',
                default: 1,
                minimum: 0,
                example: 5
            },
            status: { 
                type: 'string', 
                enum: item_status,
                default: 'available', 
                example: 'available' 
            }
        }
    },
    ItemUpdate: {
        type: 'object',
        properties: {
            name: { 
                type: 'string', 
                example: 'Camion frigorifique' 
            },
            type: { 
                type: 'string', 
                enum: item_types, 
                example: 'sonorisation'
            },
            details: { 
                type: 'object', 
                description: 'Informations supplémentaires (données spécifiques selon le type d\'équipement)',
                example: { 
                'marque': 'JBL', 
                'annee': 2024,
                'poids': '0,150 Kg',
                'decibels': 120
                }
            },
            quantity: { 
                type: 'number', 
                default: 1,
                minimum: 0,
                example: 5
            },
            status: { 
                type: 'string', 
                enum: item_status,
                example: 'available' 
            }
        }
    }
}