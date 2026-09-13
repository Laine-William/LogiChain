const mongoose = require('mongoose');

const {user_roles, user_accountStatus, user_availabilityStatus} = require('../../../shared_constants/constants');

const UserSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true, 'Le nom complet est obligatoire'],
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: function() { 
            
            return this.isNew; 
        }
    },
    role: { 
        type: String, 
        enum: user_roles, 
        default: 'user' 
    },
    accountStatus: {
        type: String,
        enum: user_accountStatus,
        default: 'pending'
    },
    availabilityStatus: {
        type: String,
        enum: user_availabilityStatus,
        default: 'offline'
    },
    resetPasswordCode: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true,
    toJSON: { 
        virtuals: true 
    },
    toObject: { 
        virtuals: true 
    }
});

UserSchema.virtual('id').get(function() {

    return this._id.toHexString();
});

module.exports = mongoose.model('User', UserSchema);