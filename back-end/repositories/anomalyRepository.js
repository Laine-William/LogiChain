const BaseRepository = require('./baseRepository');
const AnomalySchema = require('../models/schemas/anomalySchema');
const AnomalyModel = require('../models/anomalyModel');

class AnomalyRepository extends BaseRepository {
    
    constructor() {
    
        super(AnomalySchema, AnomalyModel);
    }

    async findByUserId(userId) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            userId: userId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();

        const anomaly = rawDocument.map(document => this._instantiate(document));
        
        return anomaly;
    }

    async findByEventId(eventId) {
        const rawDocument = await this.modelSchema.find({ 
                                                            eventId: eventId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();

        const anomalies = rawDocument.map(document => this._instantiate(document));
        
        return anomalies;
    }

    async findByLocation(coordinates, maxDistance) {
    
        const location = {
            location: {
                $near: {
                    $geometry: { 
                        type: "Point", 
                        coordinates: [coordinates.longitude, coordinates.latitude] 
                    },
                    $maxDistance: maxDistance
                }
            }
        };

        
        const rawDocument = await this.modelSchema.find(location).lean();
        
        
        const anomaly = rawDocument.map(document => this._instantiate(document));
        
        return anomaly;
    }

    async findByStatus(status) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            status, 
                                                            isDeleted: false 
                                                        }).lean();
        
        const anomaly = rawDocument.map(document => this._instantiate(document));

        return anomaly;
    }

    async updateStatus(id, status) {
    
        const rawDocument = await super.updateStatus(id, status);
    
        const anomaly = this._instantiate(rawDocument);
    
        return anomaly;
    }
}

module.exports = AnomalyRepository;