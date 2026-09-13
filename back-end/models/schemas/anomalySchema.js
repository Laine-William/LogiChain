const mongoose = require('mongoose');

const {anomaly_reasons, anomaly_severities, anomaly_status} = require('../../../shared_constants/constants');

const AnomalySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true,
        index: true 
    },
    logisticId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Logistic', 
        index: true 
    },
    stepId: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item',
        index: true 
    },
    reason: {
        type: String,
        enum: anomaly_reasons,
        required: [true, 'Le motif est obligatoire']
    },
    description: {
        type: String,
        required: false
    },
    severity: { 
        type: String, 
        enum: anomaly_severities
    },
    location: {
        type: { 
            type: String, 
            default: 'Point' 
        },
        coordinates: [Number] // [longitude, latitude]
    },
        status: { 
        type: String, 
        enum: anomaly_status,
        default: 'open' 
    },
        isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true
});

AnomalySchema.index({ location: '2dsphere' }); // Index pour recherche géospatiale

module.exports = mongoose.model('Anomaly', AnomalySchema);