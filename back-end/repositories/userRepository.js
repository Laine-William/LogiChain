const BaseRepository = require('./baseRepository');
const UserSchema = require('../models/schemas/userSchema');
const UserModel = require('../models/userModel');

class UserRepository extends BaseRepository {

    constructor() {
    
        super(UserSchema, UserModel);
    }

    async findByEmail(email) {

        const rawUser = await this.modelSchema.findOne({ 
            email, 
            isDeleted: false 
        }).lean();

        if (!rawUser) {

            return null;
        }

        const user = this._instantiate(rawUser);

        return user;
    }

    async findByRole(role) {
        
        const rawUsers = await this.modelSchema.find({ 
                                                        role, 
                                                        isDeleted: false 
                                                    }).lean();

        if (!rawUsers || rawUsers.length === 0) {

            return [];
        }

        const users = rawUsers.map(rawUser => {
            
            const instanceUser = this._instantiate(rawUser);
            
            return instanceUser;
        });

        return users;
    }

    async findByAccountStatus(status) {

        const rawUsers = await this.modelSchema.find({ 
            accountStatus: status, 
            isDeleted: false 
        }).lean();

        const users = rawUsers.map(rawUser => this._instantiate(rawUser));

        return users;
    }

    async findByAvailabilityStatus(availability) {
        
        const rawUsers = await this.modelSchema.find({ 
            availabilityStatus:availability, 
            isDeleted: false 
        }).lean();

        const users = rawUsers.map(rawUser => this._instantiate(rawUser));

        return users;
    }
}

module.exports = UserRepository;