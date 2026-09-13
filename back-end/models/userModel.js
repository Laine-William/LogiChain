const BaseEntity = require('./baseEntity');

class User extends BaseEntity {

    constructor(data) {

        super(data);

        this.fullName = data.fullName || '';
        this.email = data.email;
        this.role = data.role;
        this.password = data.password;
        this.accountStatus = data.accountStatus || 'pending';
        this.availabilityStatus = data.availabilityStatus || 'offline';
        this.resetPasswordCode = data.resetPasswordCode || null;
        this.resetPasswordExpires = data.resetPasswordExpires || null;
        this.isDeleted = data.isDeleted || false;
    }
}

module.exports = User;