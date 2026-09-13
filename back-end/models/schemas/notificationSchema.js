const mongoose = require('mongoose');

const {notification_types} = require('../../../shared_constants/constants');

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    message: { 
        type: String, 
        required: [true, 'Le message est obligatoire'] 
    },
    type: { 
        type: String, 
        enum: notification_types,
        default: 'system'
    },
    isRead: { 
        type: Boolean, 
        default: false,
        index: true
    },
    externalReference: { 
        type: String 
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);