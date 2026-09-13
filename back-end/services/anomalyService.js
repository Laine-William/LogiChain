const BaseService = require('./baseService');

const AnomalyRepository = require('../repositories/anomalyRepository');

const Logger = require('../utils/logger');

const {anomaly_status, anomaly_severities} = require('../../shared_constants/constants');

const anomalyRepository = new AnomalyRepository();

class AnomalyService extends BaseService {

    async getAllAnomaly(requestUser) {
        
        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {

            const anomaly = await anomalyRepository.findByUserId(requestUser.id);

            return anomaly;
        }

        const anomalies = await anomalyRepository.getAll();
            
        return anomalies;
    }

    async getAnomalyById(anomalyId, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);

        return anomaly;
    }

    async getAnomalyByUser(userId, requestUser) {
    
        const anomaly = await anomalyRepository.findByUserId(userId);
        
        this._validateNotFound(
            !anomaly || anomaly.length === 0, 
            `Aucune anomalie trouvée pour l'utilisateur ${userId}.`
        );

        this._checkUserSecurity(anomaly, requestUser);
        
        return anomaly;
    }

    async getAnomalyByEventId(eventId, requestUser) {

        this._checkAccountStatus(requestUser);

        const anomalies = await anomalyRepository.findByEventId(eventId);

        this._validateNotFound(
            !anomalies || anomalies.length === 0, 
            `Aucune anomalie trouvée pour l'événement ${eventId}.`
        );

        this._checkUserSecurity(anomalies, requestUser);
        
        return anomalies;
    }

    async getAnomalyByStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);

        const validStatus = anomaly_status;

        this._validateBadRequest(
            !validStatus.includes(status), 
            `Statut pour l'anomalie invalide : ${status}`
        );
        
        const anomaly = await anomalyRepository.findByStatus(status)

        return anomaly;
    }

    async getAnomalyBySeverity(severity, requestUser) {

        this._checkAdminAccess(requestUser);
    
        const validSeverity = anomaly_severities;
    
        this._validateBadRequest(
            !validSeverity.includes(severity), 
            `Sévérité invalide`
        );

        const anomaly = await anomalyRepository.findBySeverity(severity)
    
        return anomaly;
    }

    async getNearbyAnomaly(coordinates, radius, requestUser) {

        this._checkAccountStatus(requestUser);

        this._validateBadRequest(
            !coordinates.latitude || !coordinates.longitude, 
            `Coordonnées géographiques manquantes.`
        );

        this._validateBadRequest(
            isNaN(radius) || radius <= 0,
            `Le rayon doit être un nombre positif.`
        );

        const rawAnomalies = await anomalyRepository.findByLocation(coordinates, radius);
            
        const highSeverityOnly = rawAnomalies.filter(anomaly => anomaly.severity === 'high');

        const resultat = {
            count: highSeverityOnly.length,
            data: highSeverityOnly,
            timestamp: new Date()
        };
            
        return resultat;
    }

    async createAnomaly(data, requestUser) {

        this._checkAccountStatus(requestUser);

        const createdAnomaly = await anomalyRepository.create({ 
            ...data, 
            userId: requestUser.id 
        });
        
        return createdAnomaly;
    }

    async updateAnomaly(anomalyId, data, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);

        const isSameAnomaly = Object.keys(data).every(key => anomaly[key] === data[key]);

        this._validateConflict(
            isSameAnomaly, 
            `Aucune modification, données identiques.`
        );
       
        const updatedAnomaly = await anomalyRepository.update(anomalyId, data);

        return updatedAnomaly;
    }

    async updatePartialAnomaly(anomalyId, data, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);

        const isSameAnomaly = Object.keys(data).every(key => anomaly[key] === data[key]);

        this._validateConflict(
            isSameAnomaly, 
            `Aucune modification, données identiques.`
        );

        const updatedPartialAnomaly = await anomalyRepository.updatePartial(anomalyId, data);

        return updatedPartialAnomaly;
    }

    async updateAnomalyStatus(anomalyId, newStatus, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);
    
        this._validateBadRequest(
            !newStatus, 
            `Le statut pour l'anomalie est requise`
        );
        
        this._validateConflict(
            anomaly.status === newStatus, 
            `L'anomalie ${anomalyId} a déjà ce statut ${newStatus}`
        );

        const updatedAnomaly = await anomalyRepository.updateStatus(anomalyId, newStatus);
        
        const log = `Statut mis à jour : anomalie ${anomalyId} -> ${newStatus}`;

        Logger.info(log);

        return updatedAnomaly;
    }

    async updateAnomalySeverity(anomalyId, newSeverity, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);

        this._validateConflict(
            anomaly.severity === newSeverity, 
            `L'anomalie a déjà ce niveau de sévérité`
        );

        const severity = await anomalyRepository.updateSeverity(anomalyId, newSeverity)

        return await severity;
    }

    async deleteAnomaly(anomalyId, requestUser) {

        const anomaly = await anomalyRepository.getById(anomalyId);

        this._validateNotFound(
            !anomaly, 
            `Anomalie ${anomalyId} introuvable`
        );

        this._checkUserSecurity(anomaly, requestUser);

        this._validateConflict(
            anomaly.isDeleted, 
            `Anomalie ${anomalyId} a déjà été supprimée`
        );

        const deletedAnomaly = await anomalyRepository.softDelete(anomalyId);

        return deletedAnomaly;
    }
}

module.exports = new AnomalyService();