const mongoose = require('mongoose');

const {event_status} = require('../../../shared_constants/constants');

const ZoneSubSchema = new mongoose.Schema({
    zone: { 
        type: { 
            type: String, 
            enum: ['Polygon'], 
            required: true 
        },
        coordinates: { 
            type: [[[Number]]],
            required: true 
        }
    },
    status: { 
        type: String, 
        default: 'active' 
    }
}, { _id: true });

const EventSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    name: { 
        type: String, 
        required: [true, 'Le nom est obligatoire']  
    },
    description: { 
        type: String 
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date 
    },
    zones: [ZoneSubSchema], // Tableau de zones géospatiales intégrées
    status: { 
        type: String, 
        enum: event_status, 
        default: 'active' 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);