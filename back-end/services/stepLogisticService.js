const BaseService = require('./baseService');

const LogisticRepository = require('../repositories/logisticRepository');
const LogisticModel = require('../models/schemas/logisticSchema');
const logisticService = require('./logisticService');

const Logger = require('../utils/logger');

const {logistic_step_status} = require('../../shared_constants/constants');

const logisticRepository = new LogisticRepository(LogisticModel);

const lockedStatus = ['in_progress', 'delayed', 'completed', 'archived', 'cancelled', 'blocked'];
const allowTransitionStatus = {
    'to_do': ['in_progress', 'delayed', 'cancelled'],
    'in_progress': ['completed', 'blocked', 'delayed', 'cancelled'],
    'blocked': ['in_progress', 'cancelled'],
    'delayed': ['in_progress', 'cancelled'],
    'completed': ['archived'],
    'cancelled': ['archived'],
    'archived': []  // État final
};

class StepLogisticService extends BaseService {

    async getAllStepLogistic(logisticId, requestUser) {

        const logistic = await logisticService.getLogisticById(logisticId, requestUser);

        const step = logistic.steps || [];

        return step;
    }

    async getStepLogisticById(logisticId, stepId, requestUser) {
        const logistic = await logisticService.getLogisticById(logisticId, requestUser);

        const step = logistic.steps.find(step => {
            // Gère à la fois le string brut, l'ObjectId Mongoose et l'objet { $oid: '...' }
            const currentId = step._id?.$oid || step._id?.toString() || step._id;
            const searchId = stepId?.$oid || stepId?.toString() || stepId;
            return currentId === searchId;
        });

        this._validateNotFound(
            !step, 
            `Étape ${stepId} introuvable pour logistique ${logisticId}`
        );

        return step;
    }

    async getStepLogisticByStatus(logisticId, status, requestUser) {

        const validStatus = logistic_step_status;

        this._validateBadRequest(
            !validStatus.includes(status), 
            `Statut logistique invalide : ${status}`
        );

        await logisticService.getLogisticById(logisticId, requestUser);

        const logistic = await logisticRepository.findStepByStatus(logisticId, status)

        return logistic;
    }

    async updateStepLogistic(logisticId, stepId, data, requestUser) {

        this._validateBadRequest(
            data.status, 
            `Modification interdite du statut`
        );
        
        const step = await this.getStepLogisticById(logisticId, stepId, requestUser);

        this._validateConflict(
            lockedStatus.includes(step.status), 
            `Modification impossible : l'étape a déjà ce status '${step.status}'`
        );

        const updatedStep = await logisticRepository.updateStepInArray(logisticId, stepId, data);

        return updatedStep;
    }

    async updatePartialStepLogistic(logisticId, stepId, data, requestUser) {

        this._validateBadRequest(
            data.status, 
            `Modification interdite du statut`
        );
        
        
        const step = await this.getStepLogisticById(logisticId, stepId, requestUser);

        this._validateConflict(
            lockedStatus.includes(step.status), 
            `Modification impossible : l'étape a déjà ce status '${step.status}'`
        );

        const updatedPartailStep = await logisticRepository.updateStepInArray(
            logisticId, 
            stepId, 
            data, 
            '$set'
        );

        return updatedPartailStep;
    }

    async updateStatusStepLogistic(logisticId, stepId, data, requestUser) {

        const newStatus = data.status;
            
        const step = await this.getStepLogisticById(logisticId, stepId, requestUser);
    
        this._validateBadRequest(
            !newStatus, 
            `Le statut pour l'étape logistique est requis.`
        );
        
        this._validateConflict(
            step.status === newStatus, 
            `L'étape logistique ${stepId} a déjà ce statut : ${newStatus}`
        );
        
        const transitionStatus = allowTransitionStatus[step.status] || [];
            
        this._validateConflict(
            !transitionStatus.includes(newStatus), 
            `Transition interdite : impossible de passer le status pour l'étape logistique de '${step.status}' à '${newStatus}'.`
        );

        const statusHistory = step.statusHistory || [];
        statusHistory.push({
            status: step.status,
            changedAt: new Date(),
            userId: requestUser.id
        });
    
        const updatedLogistic = await logisticRepository.updateStepInArray(
            logisticId, 
            stepId, 
            { 
                status: newStatus, 
                statusHistory 
            }, 
            '$set'
        );
    
        const log = `Statut mis à jour : étape logistique ${stepId} -> ${newStatus}`;
    
        Logger.info(log);
            
        return updatedLogistic;
    }

    async deleteStepLogistic(logisticId, stepId, requestUser) {

        const step = await this.getStepLogisticById(logisticId, stepId, requestUser);
        
        this._validateNotFound(
            !step, 
            `Étape ${stepId} non trouvée dans la logistique ${logisticId}`
        );

        this._validateConflict(
            lockedStatus.includes(step.status), 
            `Suppression impossible : l'étape est en état '${step.status}' verrouillé.`
        );

        const deletedStep = await logisticRepository.softDeleteStep(logisticId, stepId);
        
        this._validateNotFound(
            !deletedStep, 
            `Erreur lors de la suppression de l'étape ${stepId}`
        );

        return deletedStep;
    }
}

module.exports = new StepLogisticService();