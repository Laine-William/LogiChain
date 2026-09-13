const BaseEntity = require('./baseEntity');

class Event extends BaseEntity {

    constructor(data) {
    
        super(data);
    
        this.userId = data.userId || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.startDate = data.startDate || new Date();
        this.endDate = data.endDate || new Date();
        this.zones = data.zones || []; // // Tableau de données zones géospatiales sous forme Polygon (GeoJSON)
        this.eventDate = data.eventDate || new Date();
        this.status = data.status || 'active';
        this.isDeleted = data.isDeleted || false;
    }
}

module.exports = Event;