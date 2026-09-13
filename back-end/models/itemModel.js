const BaseEntity = require('./baseEntity');
const HistoryLog = require('./historyLog');

class Item extends BaseEntity {

    constructor(data) {

        super(data);

        this.userId = data.userId || null;
        this.name = data.name;
        this.type = data.type || 'autre';
        this.quantity = data.quantity || 1;
        this.details = data.details || {};
        this.status = data.status;
        this.isDeleted = data.isDeleted || false;
        this.history = (data.history || []).map(logData => {

            const historyLog = new HistoryLog(logData);

            return historyLog;
        });
    }
}

module.exports = Item;