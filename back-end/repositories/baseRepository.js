class BaseRepository {

    constructor(modelSchema, modelClass) {

        this.modelSchema = modelSchema;
        this.modelClass = modelClass;
    }

    _instantiate(document) {
        
        const hasDocument = !!document;
        
        let modelSchema = null;
        
        if (hasDocument) {
        
            modelSchema = new this.modelClass(document);
        }
        
        return modelSchema;
    }

    async getById(id) {

        const rawDocument = await this.modelSchema.findById(id).lean();

        const modelSchema = this._instantiate(rawDocument);

        return modelSchema;
    }

    async getAll() {

        const rawDocument = await this.modelSchema.find().lean();

        const modelSchema = rawDocument.map(document => this._instantiate(document));

        return modelSchema;
    }

    async create(data) {

        const rawDocument = await this.modelSchema.create(data);

        const objectDocument = rawDocument.toObject();

        const modelSchema = this._instantiate(objectDocument);
        
        return modelSchema;
    }

    async update(id, data) {
        
        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                id, 
                                                                data, 
                                                                { returnDocument: 'after' }
                                                            ).lean();

        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }

    async updatePartial(id, data) {
        
        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                id, 
                                                                { $set: data }, 
                                                                { returnDocument: 'after' }
                                                            ).lean();
        
        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }

    async updateStatus(id, status) {
        
        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                id, 
                                                                { status }, 
                                                                { returnDocument: 'after' }
                                                            ).lean();

        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }
    
    async softDelete(id) {

        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                id, 
                                                                { isDeleted: true }, 
                                                                { returnDocument: 'after' }
                                                            ).lean();

        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }

    async restore(id) {

        const rawDocument = await this.modelSchema.findByIdAndUpdate(
                                                                id, 
                                                                { isDeleted: false }, 
                                                                { returnDocument: 'after' }
                                                            ).lean();

        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }

    async delete(id) {

        const rawDocument = await this.modelSchema.findByIdAndDelete(id).lean();
        
        const modelSchema = this._instantiate(rawDocument);
        
        return modelSchema;
    }
}

module.exports = BaseRepository;