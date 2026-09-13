const BaseEntity = require('./baseEntity');

class Anomaly extends BaseEntity {

    constructor(data) {

        super(data);

        this.userId = data.userId || null;
        this.eventId = data.eventId || null;
        this.logisticId = data.logisticId || null;
        this.stepId = data.stepId || null;
        this.itemId = data.itemId || null;
        this.reason = data.reason;
        this.description = data.description;
        this.location = data.location; // Coordonnées géolocalisées (point)
        this.severity = data.severity;
        this.status = data.status;
        this.isDeleted = data.isDeleted || false;
    }
}

module.exports = Anomaly;