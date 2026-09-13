const BaseRepository = require('./baseRepository');
const NotificationSchema = require('../models/schemas/notificationSchema');
const NotificationModel = require('../models/notificationModel');

class NotificationRepository extends BaseRepository {

    constructor() {
    
        super(NotificationSchema, NotificationModel);
    }

    async findByUserId(userId) {
        
    const rawDocument = await this.modelSchema.find({ 
                                                        userId: userId,
                                                        isDeleted: false 
                                                    })
                                                    .sort(
                                                        { createdAt: -1 }
                                                    ).lean();

        const notification = rawDocument.map(document => this._instantiate(document));
        
        return notification;
    }

    async findByType(type) {

        const rawDocument = await this.modelSchema.find({ 
                                                        type
                                                        }).lean();
        
        const notification = rawDocument.map(document => this._instantiate(document));

        return notification;
    }

    async updateType(id, type) {

        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                        id, 
                                                                        { type }, 
                                                                        { new: true }
                                                                    ).lean();

        const notification = this._instantiate(rawDocument);
        
        return notification;
    }

    async markAsRead(id) {

        const rawDocument = await this.modelSchema.findByIdAndUpdate(
            id, 
            { isRead: true }, 
            { new: true }
        );

        const notification = this._instantiate(rawDocument);
        
        return notification;
    }

    async markAllAsRead(userId) {

        await this.modelSchema.updateMany(
            { 
                userId, 
                isRead: false, 
                isDeleted: false 
            }, 
            { isRead: true }
        );

        const rawDocument = await this.modelSchema.find(
            {
                userId, 
                isDeleted: false 
            }
        ).sort(
            { createdAt: -1 }
        ).lean();

        const notification = rawDocument.map(document => this._instantiate(document));

        return notification;
    }
}

module.exports = NotificationRepository;