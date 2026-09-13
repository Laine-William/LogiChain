const mongoose = require('mongoose');

const {logistic_vehicle_types, logistic_step_status, logistic_status} = require('../../../shared_constants/constants');

// 🟢 Sous-schéma pour les points GeoJSON
const PointSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Point'], 
        default: 'Point' 
    },
    coordinates: { 
        type: [Number], // [longitude, latitude]
        required: true 
    }
}, { _id: false });

const StatusHistorySchema = new mongoose.Schema({
    status: { 
        type: String, 
        required: true 
    },
    changedAt: { 
        type: Date, 
        default: Date.now 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { 
    _id: false 
});

const StepSchema = new mongoose.Schema({
    location: String,
    position: PointSchema,
    distance: Number,
    vehicle: {
        type: String,
        enum: logistic_vehicle_types,
        default: 'truck'
    },
    status: { 
        type: String, 
        enum: logistic_step_status,
        default: 'to_do' 
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    statusHistory: [StatusHistorySchema]
}, 
{ 
    _id: true,
    timestamps: false
});

const LogisticSchema = new mongoose.Schema({
    userId: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    }],
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: false,
        index: true 
    },
    departureDestination: {
        type: String, 
        required: [true, 'La destination de départ est obligatoire'] 
    },
    departurePosition: PointSchema,
    arrivalDestination: {
        type: String, 
        required: [true, 'La destination d\'arrivée est obligatoire']
    },
    arrivalPosition: PointSchema,
    totalDistance: { 
        type: Number, 
        default: 0 
    },
    totalFuelConsumption: { 
        type: Number, 
        default: 0 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    status: { 
        type: String, 
        enum: logistic_status, 
        default: 'starting' 
    },
    
    steps: [StepSchema],
    statusHistory: [StatusHistorySchema]
}, 
{ 
    timestamps: true
});

// Idex géospatiaux pour optimiser les requêtes sur les cartes
LogisticSchema.index({ departurePosition: '2dsphere' });
LogisticSchema.index({ arrivalPosition: '2dsphere' });
LogisticSchema.index({ 'steps.position': '2dsphere' });

module.exports = mongoose.model('Logistic', LogisticSchema);