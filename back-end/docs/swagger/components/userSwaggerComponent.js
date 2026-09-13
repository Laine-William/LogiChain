const {user_roles, user_accountStatus, user_availabilityStatus} = require('../../../../shared_constants/constants');


module.exports = {
    User: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            _id: { 
                type: 'string', 
                example: '6a4cfc028b7d4a94222a950c' 
            },
            fullName: { 
                type: 'string', 
                example: 'Jean Dupont' 
            },
            email: { 
                type: 'string', 
                format: 'email', 
                example: 'jean.dupont@logichain.fr' 
            },
            role: { 
                type: 'string', 
                enum: user_roles, 
                default: 'user', 
                example: 'user' 
            },
            accountStatus: {
                type: 'string',
                enum: user_accountStatus,
                default: 'active',
                example: 'active'
            },
            availabilityStatus: {
                type: 'string',
                enum: user_availabilityStatus,
                default: 'offline',
                example: 'offline'
            },
            resetPasswordCode: { 
                type: 'string', 
                nullable: true,
                example: '123456' 
            },
            resetPasswordExpires: { 
                type: 'string', 
                format: 'date-time', 
                nullable: true 
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
    UserRegister: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { 
                type: 'string', 
                format: 'email', 
                example: 'jean.dupont@logichain.fr' 
            },
            password: { 
                type: 'string', 
                minLength: 8, 
                example: 'Secret123!' 
            },
            role: { 
                type: 'string', 
                enum: user_roles, 
                default: 'user', 
                example: 'user'
            }
        }
    },
    UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { 
                type: 'string', 
                format: 'email', 
                example: 'jean.dupont@logichain.fr' 
            },
            password: { 
                type: 'string', 
                minLength: 8, 
                example: 'Secret123!' 
            }
        }
    },
    UserUpdate: {
        type: 'object',
        properties: {
            email: { 
                type: 'string', 
                format: 'email', 
                example: 'jean.dupont@logichain.fr' 
            },
            role: { 
                type: 'string', 
                enum: user_roles, 
                example: 'user' 
            },
            accountStatus: { 
                type: 'string', 
                enum: user_accountStatus, 
                example: 'active' 
            },
            availabilityStatus: { 
                type: 'string', 
                enum: user_availabilityStatus, 
                example: 'offline' 
            }
        }
    }
};