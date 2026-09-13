const AnomalyService = require('../services/anomalyService');
const { broadcast } = require('../utils/sse');

exports.getAll = async (request, response, next) => {
    
    try {
    
        const anomalies = await AnomalyService.getAllAnomaly(request.user);
    
        response.status(200).json(anomalies);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getById = async (request, response, next) => {
    
    try {

        const { id } = request.params;
        
        const anomaly = await AnomalyService.getAnomalyById(id, request.user);
        
        response.status(200).json(anomaly);
        
    } catch (error) {
        
        next(error);
    }
};

exports.getByUser = async (request, response, next) => {
    
    try {
    
        const { userId } = request.params;
    
        const anomaly = await AnomalyService.getAnomalyByUser(userId, request.user);
    
        response.status(200).json(anomaly);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getByStatus = async (request, response, next) => {
    
    try {
    
        const { status } = request.params;
    
        const anomaly = await AnomalyService.getAnomalyByStatus(status, request.user);
    
        response.status(200).json(anomaly);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getBySeverity = async (request, response, next) => {
    
    try {
    
        const { severity } = request.params;
    
        const anomaly = await AnomalyService.getAnomalyBySeverity(severity, request.user);
    
        response.status(200).json(anomaly);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getByEvent = async (request, response, next) => {
    
    try {
    
        const { eventId } = request.params;
    
        const anomalies = await AnomalyService.getAnomalyByEventId(eventId, request.user);
    
        response.status(200).json(anomalies);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getNearby = async (request, response, next) => {

    try {
    
        const { latitude, longitude, radius } = request.query;
        
        const anomaly = await AnomalyService.getNearbyAnomaly({ 
                                                                latitude: parseFloat(latitude), 
                                                                longitude: parseFloat(longitude) 
                                                            }, parseFloat(radius));
        
        response.status(200).json(anomaly);
    
    } catch (error) {
    
        next(error);
    }
};

exports.create = async (request, response, next) => {
    
    try {
    
        const data = request.body;

        const addedAnomaly = await AnomalyService.createAnomaly(data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'CREATE',
            payload: addedAnomaly
        });

        response.status(201).json(addedAnomaly);
    
    } catch (error) {
    
        next(error);
    }
};

const cleanBody = (body) => {
    
    const cleanFieldBody = { ...body };
    
    ['__v', '_id', 'createdAt', 'updatedAt', 'isDeleted'].forEach(field => delete cleanFieldBody[field]);
    
    return cleanFieldBody;
};

exports.update = async (request, response, next) => {
  
    try {
    
        const { id } = request.params;
        const data = cleanBody(request.body);
    
        const updatedAnomaly = await AnomalyService.updateAnomaly(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'UPDATE',
            payload: updatedAnomaly
        });

        response.status(200).json(updatedAnomaly);
  
    } catch (error) {
  
        next(error);
    }
};

exports.updatePartial = async (request, response, next) => {
  
    try {
  
        const { id } = request.params;
        const data = cleanBody(request.body);

        if (Object.keys(data).length === 0) {
            
            const error_message = { message: `Aucune donnée fournie pour la mise à jour.`};

            return response.status(400).json(error_message);
        }
    
        const updatedPartialAnomaly = await AnomalyService.updatePartialAnomaly(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'UPDATE',
            payload: updatedPartialAnomaly
        });

        response.status(200).json(updatedPartialAnomaly);
  
    } catch (error) {
  
        next(error);
    }
};

exports.updateStatus = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { status } = request.body;
        
        const updatedStatusAnomaly = await AnomalyService.updateAnomalyStatus(id, status, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'UPDATE',
            payload: updatedStatusAnomaly
        });

        const statusAnomaly = {
            message: `Statut de l'anomalie mise à jour`,
            item: updatedStatusAnomaly
        };
        
        response.status(200).json(statusAnomaly);
    
    } catch (error) {
        
        next(error);
    }
};

exports.updateSeverity = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
    
        const { severity } = request.body;
    
        const updatedAnomaly = await AnomalyService.updateAnomalySeverity(id, severity, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'UPDATE',
            payload: updatedAnomaly
        });

        const anomaly = { 
            message: `Sévérité de l'anomalie mise à jour`, 
            item: updatedAnomaly 
        }

        response.status(200).json(anomaly);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.delete = async (request, response, next) => {
  
    try {
  
        const { id } = request.params;
  
        const deletedAnomaly = await AnomalyService.deleteAnomaly(id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'anomaly',
            action: 'DELETE',
            payload: {id}
        });

        const anomaly = { 
            message: `Anomalie supprimée`, 
            anomaly: deletedAnomaly 
        };
  
        response.status(200).json(anomaly);
  
    } catch (error) {
  
        next(error);
    }
};