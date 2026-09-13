const BaseEntity = require('./baseEntity');

class Notification extends BaseEntity {

    constructor(data = {}) {

        super(data);

        this.userId = data.userId || null;
        this.message = data.message || '';
        this.type = data.type || 'system';
        this.isRead = data.isRead || false;
    }
}

module.exports = Notification;