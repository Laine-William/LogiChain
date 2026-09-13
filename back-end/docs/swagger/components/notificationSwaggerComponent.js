const {notification_types} = require('../../../../shared_constants/constants');

module.exports = {
    Notification: {
        type: 'object',
        required: ['userId', 'message'],
        properties: {
            _id: { 
                type: 'string', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            userId: { 
                type: 'string', 
                description: 'ID de l\'utilisateur (format ObjectId MongoDB 24 caractères)', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            message: { 
                type: 'string', 
                minLength: 10, 
                maxLength: 250, 
                example: 'Une nouvelle anomalie a été détectée dans le secteur B.' 
            },
            type: { 
                type: 'string', 
                enum: notification_types, 
                default: 'system',
                example: 'system' 
            },
            isRead: { 
                type: 'boolean', 
                default: false,
                example: false
            },
            externalReference: { 
                type: 'string',
                example: 'ANOMALY_12345'
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
    NotificationCreate: {
        type: 'object',
        required: ['userId', 'message'],
        properties: {
            userId: { 
                type: 'string', 
                description: 'ID de l\'utilisateur', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            message: { 
                type: 'string', 
                minLength: 10, 
                maxLength: 250, 
                example: 'Une nouvelle anomalie a été détectée dans le secteur B.' 
            },
            type: { 
                type: 'string', 
                enum: notification_types, 
                default: 'system',
                example: 'system' 
            },
            externalReference: { 
                type: 'string',
                example: 'ANOMALY_12345'
            }
        }
    }
};