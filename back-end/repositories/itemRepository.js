const BaseRepository = require('./baseRepository');
const ItemSchema = require('../models/schemas/itemSchema');
const ItemModel = require('../models/itemModel');

class ItemRepository extends BaseRepository {
    
    constructor() {

        super(ItemSchema, ItemModel);
    }

    async findByUserId(userId) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            userId: userId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();

        const item = rawDocument.map(document => this._instantiate(document));
        
        return item;
    }

    async findByStatus(status) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            status, 
                                                            isDeleted: false 
                                                        }).lean();
        
        const item = rawDocument.map(document => this._instantiate(document));

        return item;
    }

    async updateStatus(id, status) {
    
        const rawDocument = await super.updateStatus(id, status);
    
        const item = this._instantiate(rawDocument);
    
        return item;
    }
}

module.exports = ItemRepository;