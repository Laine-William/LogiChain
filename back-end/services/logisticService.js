const BaseService = require('./baseService');

const LogisticRepository = require('../repositories/logisticRepository');
const LogisticModel = require('../models/logisticModel');

const CarbonFootprintService = require('./carbonFootprintService');

const Logger = require('../utils/logger');

const {logistic_status} = require('../../shared_constants/constants');

const logisticRepository = new LogisticRepository();

const lockedStatus = ['in_transit', 'on_hold', 'delivered', 'archived', 'cancelled'];
const allowTransitionStatus = {
    'starting': ['in_preparation', 'cancelled'],
    'in_preparation': ['in_transit', 'cancelled'],
    'in_transit': ['delivered', 'on_hold'],
    'on_hold': ['in_transit', 'cancelled'],
    'delivered': ['archived'],
    'cancelled': [], // État final
    'archived': []   // État final
};

class LogisticService extends BaseService {

    async getAllLogistic(requestUser) {

        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {

            const logistic = await logisticRepository.findByUserId(requestUser.id);

            return logistic;
        }

        const logistics = await logisticRepository.getAll();
            
        return logistics;
    }

    async getLogisticById(logisticId, requestUser) {

        const logistic = await logisticRepository.getById(logisticId);

        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );

        this._checkUserSecurity(logistic, requestUser);

        return logistic;
    }

    async getLogisticByUser(userId, requestUser) {
    
        const logistic = await logisticRepository.findByUserId(userId);
        
        this._validateNotFound(
            !logistic, 
            `Logistique introuvable pour l'utilisateur ${userId}`
        );

        this._checkUserSecurity(logistic, requestUser);
        
        return logistic;
    }

    async getLogisticByStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);

        const validStatus = logistic_status;

        this._validateBadRequest(
            !validStatus.includes(status), 
            `Statut logistique invalide : ${status}`
        );

        const logistic = await logisticRepository.findByStatus(status);

        return logistic;
    }

    async getEventById(eventId, requestUser) {

        this._checkAccountStatus(requestUser);

        const logistics = await logisticRepository.findByEventId(eventId);

        this._validateNotFound(
            !logistics || logistics.length === 0, 
            `Aucune logistique trouvée pour l'événement ${eventId}.`
        );

        this._checkUserSecurity(logistics, requestUser);
        
        return logistics;
    }

    async createLogistic(data, requestUser) {

        this._checkAccountStatus(requestUser);

        const rawUsers = data.userId;
        const assignedUsers = Array.isArray(rawUsers) ? rawUsers : (rawUsers ? [rawUsers] : [requestUser.id]);

        const createdLogistic = await logisticRepository.create({ 
            ...data, 
            userId: assignedUsers 
        });

        return createdLogistic;
    }

    async updateLogistic(logisticId, data, requestUser) {
        
        const logistic = await logisticRepository.getById(logisticId);

        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );
        
        this._checkUserSecurity(logistic, requestUser);

        const updateData = { ...data };

        if (updateData.status) {
            if (updateData.status === logistic.status) {
                delete updateData.status;
            } else {
                this._validateBadRequest(true, `Modification interdite du statut`);
            }
        }

        this._validateConflict(
            lockedStatus.includes(logistic.status), 
            `Modification impossible pour : ${logisticId} avec le statut : '${logistic.status}'.`
        );

        if (updateData.userId) {
            updateData.userId = Array.isArray(updateData.userId) ? updateData.userId : [updateData.userId];
        }

        const isSameLogistic = Object.keys(updateData).every(key => logistic[key] === updateData[key]);

        this._validateConflict(
            isSameLogistic, 
            `Aucune modification, données identiques.`
        );

        const updatedLogistic = await logisticRepository.update(logisticId, updateData);

        return updatedLogistic;
    }

    async updatePartialLogistic(logisticId, data, requestUser) {
        
        const logistic = await logisticRepository.getById(logisticId);

        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );
        
        this._checkUserSecurity(logistic, requestUser);
        
        const updateData = { ...data };

        if (updateData.status) {
            if (updateData.status === logistic.status) {
                delete updateData.status;
            } else {
                this._validateBadRequest(true, `Modification interdite du statut`);
            }
        }
        
        this._validateConflict(
            lockedStatus.includes(logistic.status), 
            `Modification impossible, statut '${logistic.status}' verrouillé.`
        );

        if (updateData.userId) {
            updateData.userId = Array.isArray(updateData.userId) ? updateData.userId : [updateData.userId];
        }

        const isSameLogistic = Object.keys(updateData).every(key => logistic[key] === updateData[key]);

        this._validateConflict(
            isSameLogistic, 
            `Aucune modification, données identiques.`
        );

        const updatedPartiaLogistic = await logisticRepository.updatePartial(logisticId, updateData);
        
        return updatedPartiaLogistic;
    }

    async updateLogisticStatus(logisticId, newStatus, requestUser) {
        
        const logistic = await logisticRepository.getById(logisticId);
   
        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );
        
        this._checkUserSecurity(logistic, requestUser);

        this._validateBadRequest(
            !newStatus, 
            `Le statut pour l'anomalie est requise`
        );
        
        this._validateConflict(
            logistic.status === newStatus, 
            `L'anomalie ${logisticId} a déjà ce statut ${newStatus}`
        );

        const transitionStatus = allowTransitionStatus[logistic.status] || [];
        
        this._validateConflict(
            !transitionStatus.includes(newStatus), 
            `Changement interdite : impossible de passer de '${logistic.status}' à '${newStatus}'.`
        );

        const statusHistory = logistic.statusHistory || [];
        statusHistory.push({
            status: logistic.status,
            changedAt: new Date(),
            userId: requestUser.id
        });

        const logisticModel = new LogisticModel({ 
            ...logistic.toObject ? logistic.toObject() : logistic, status: newStatus 
        });
        
        const carbonImpact = logisticModel.calculateCarbonImpactLogistic(CarbonFootprintService);

        const updatedLogistic = await logisticRepository.updatePartial(logisticId, {
            status: newStatus,
            statusHistory,
            carbonImpact
        });

        const log = `Statut mis à jour : logistique ${logisticId} -> ${newStatus}`;

        Logger.info(log);
        
        return updatedLogistic;
    }

    async deleteLogistic(logisticId, requestUser) {

        const logistic = await logisticRepository.getById(logisticId);
   
        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );
        
        this._checkUserSecurity(logistic, requestUser);

        this._validateConflict(
            lockedStatus.includes(logistic.status), 
            `Suppression impossible, statut '${logistic.status}' verrouillé.`
        );

        this._validateConflict(
            logistic.isDeleted, 
            `Logistique ${logisticId} a déjà été supprimée.`
        );

        const deletedLogistic = await logisticRepository.softDelete(logisticId);

        return deletedLogistic;
    }

    async updateLogisticProgress(logisticId, stepData, requestUser) {

        const logistic = await logisticRepository.getById(logisticId);
        
        this._validateNotFound(
            !logistic, 
            `Logistique ${logisticId} introuvable`
        );
        
        this._checkUserSecurity(logistic, requestUser);
        
        const carbonPrint = CarbonFootprintService.calculateEmission(stepData.distance, stepData.vehicle);

        const stepDataWithFuel = {
            ...stepData,
            fuelConsumption: carbonPrint
        };

        const updatedLogisticProgress = await logisticRepository.addStep(logisticId, stepDataWithFuel);
        
        const log = `Étape ajoutée. Empreinte carbone calculée : ${carbonPrint}kg`;

        Logger.info(log);

        const resultEmission = { 
            logistic: updatedLogisticProgress, 
            emission: carbonPrint 
        };
        
        return resultEmission;
    }

    async calculateCarbonImpactLogistic(logisticId, requestUser) {

        const logistic = await this.getLogisticById(logisticId);
        
        const logisticModel = new LogisticModel(logistic);

        this._checkUserSecurity(logistic, requestUser);
    
        // 3. Délégation du calcul à l'objet métier
        const impact = logisticModel.calculateCarbonImpactLogistic(CarbonFootprintService);
    
        return impact;
    }
}
 
module.exports = new LogisticService();