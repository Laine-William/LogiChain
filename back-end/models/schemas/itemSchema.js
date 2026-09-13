const mongoose = require('mongoose');

const {item_status, item_types} = require('../../../shared_constants/constants');

const ItemSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: item_types,
        required: true 
    },
    details: { 
        type: mongoose.Schema.Types.Mixed 
    }, // Données spécifiques selon le type
    quantity: { 
        type: Number, 
        required: true,
        default: 1,
        min: 0
    },
    status: { 
        type: String, 
        enum: item_status,
        default: 'available' 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);