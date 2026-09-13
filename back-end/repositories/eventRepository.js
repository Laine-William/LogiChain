const BaseRepository = require('./baseRepository');
const EventSchema = require('../models/schemas/eventSchema');
const EventModel = require('../models/eventModel');

class EventRepository extends BaseRepository {
    
    constructor() {
    
        super(EventSchema, EventModel);
    }

    async getDashboardStatistic() {
        
        const data = [
                            { 
                                $match: 
                                { 
                                    status: 'active',
                                    isDeleted: false
                                } 
                            },
                            { 
                                $unwind: "$zones" 
                            },
                            { 
                                $group: 
                                { 
                                    _id: "$zones._id",
                                    count: { $sum: 1 } 
                                } 
                            }
                        ];

        const statistic = await this.modelSchema.aggregate(data);

        const formattedStatistic = statistic.map(stat => ({
                                                    zone: stat._id,
                                                    totalEvents: stat.count
                                                }));

        return formattedStatistic;
    }

    async getDashboardStatisticByUser(userId) {

        const data = [
            { 
                $match: { 
                    userId: userId,
                    status: 'active',
                    isDeleted: false
                } 
            },
            { 
                $group: { 
                    _id: "$zone", 
                    count: { $sum: 1 } 
                } 
            }
        ];

        const statistic = await this.modelSchema.aggregate(data);

        const formattedStatistic = statistic.map(stat => ({
                                                    zone: stat._id,
                                                    totalEvents: stat.count
                                                }));

        return formattedStatistic;
    }

    async findByUserId(userId) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            userId: userId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();

        const event = rawDocument.map(document => this._instantiate(document));
        
        return event;
    }

    async findByStatus(status) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            status, 
                                                            isDeleted: false 
                                                        }).lean();
        
        const event = rawDocument.map(document => this._instantiate(document));

        return event;
    }

    async updateStatus(id, status) {
    
        const rawDocument = await super.updateStatus(id, status);
    
        const event = this._instantiate(rawDocument);
    
        return event;
    }
}

module.exports = EventRepository;