const BaseRepository = require('./baseRepository');
const LogisticSchema = require('../models/schemas/logisticSchema');
const LogisticModel = require('../models/logisticModel');

const mongoose = require('mongoose');

class LogisticRepository extends BaseRepository {

    constructor() {
    
        super(LogisticSchema, LogisticModel);
    }

    async findByUserId(userId) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            userId: userId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();

        const logistic = rawDocument.map(document => this._instantiate(document));
        
        return logistic;
    }

    async findByEventId(eventId) {
        
        const rawDocument = await this.modelSchema.find({ 
                                                            eventId: eventId,
                                                            isDeleted: false 
                                                        })
                                                        .sort({ createdAt: -1 })
                                                        .lean();
        
        const logistics = rawDocument.map(document => this._instantiate(document));
        
        return logistics;
    }

    async findByStatus(status) {
        
        const logistic = await this.modelSchema.find({ 
                                                        status, 
                                                        isDeleted: false 
                                                    }).lean(); 

        return logistic;
    }

    async findStepByStatus(logisticId, status) {

        const result = await this.modelSchema.aggregate([
            { 
                $match: { _id: new mongoose.Types.ObjectId(logisticId) } 
            },
            { 
                $project: {
                    steps: {
                        $filter: {
                            input: "$steps",
                            as: "step",
                            cond: { $eq: ["$$step.status", status] }
                        }
                    }
                }
            }
        ]);

        const stepLogistic = result.length > 0 ? result[0].steps : [];

        return stepLogistic;
    }

    async addStep(logisticId, stepData) {
        
        try {
            const updatedDocument = await this.modelSchema.findByIdAndUpdate(
                logisticId,
                { 
                    $push: { steps: stepData } 
                },
                { 
                    returnDocument: 'after',
                    runValidators: true 
                }
            ).lean();

            if (!updatedDocument) {
                throw new Error(`Logistique ${logisticId} introuvable.`);
            }

            const logistic = this._instantiate(updatedDocument);
                
            return logistic;
            
        } catch (error) {
            const message = `Erreur lors de l'ajout de l'étape pour ${logisticId}: ${error.message}`;
            throw new Error(message);
        }
    }
    
    async updateStepInArray(
                        logisticId, 
                        stepId, 
                        data, 
                        operation = '$set'
                    ) {
        
        // 🟢 Transformation de l'objet data en chemins aplatis (ex: "steps.$[element].status": value)
        const flattenedData = {};
        for (const [key, value] of Object.entries(data)) {
            flattenedData[`steps.$[element].${key}`] = value;
        }

        const updateQuery = { [operation]: flattenedData };
            
        const arrayFilters = [{ "element._id": new mongoose.Types.ObjectId(stepId) }];
            
        const document = await this.modelSchema.findByIdAndUpdate(
            logisticId, 
            updateQuery, 
            { 
                arrayFilters, 
                returnDocument: 'after' 
            }
        ).lean();
            
        const logistic = this._instantiate(document);
    
        return logistic;
    }
    
    async deleteStep(logisticId, stepId) {
    
        const deletedDocument = await this.modelSchema.findByIdAndUpdate(
            logisticId, 
            { 
                $pull: 
                    { steps: { _id: stepId } } 
            }, 
            { 
                returnDocument: 'after' 
            }
        ).lean();                                                            
            
        const logistic = this._instantiate(deletedDocument);
            
        return logistic;
    }    

    async softDeleteStep(logisticId, stepId) {

        const softDeleteDocument = await this.modelSchema.findByIdAndUpdate(
            logisticId,
            { 
                $set: 
                { 
                    "steps.$[element].isDeleted": true 
                } 
            },
            { 
                arrayFilters: [{ "element._id": stepId }], 
                
                returnDocument: 'after' 
            }
        ).lean();

        const logistic =  this._instantiate(softDeleteDocument);

        return logistic;
    }

    async restoreStep(logisticId, stepId) {
        
        const restoreDocument = await this.modelSchema.findByIdAndUpdate(
            logisticId,
            { 
                $set: 
                { 
                    "steps.$[element].isDeleted": false 
                } 
            },
            { 
                arrayFilters: [{ "element._id": stepId }], 
                returnDocument: 'after' 
            }
        ).lean();

        const logistic =  this._instantiate(restoreDocument);

        return logistic;
    }
}

module.exports = LogisticRepository;