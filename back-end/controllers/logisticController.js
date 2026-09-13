const LogisticService = require('../services/logisticService');
const { broadcast } = require('../utils/sse');

exports.getAll = async (request, response, next) => {
    
    try {
        
        const logistics = await LogisticService.getAllLogistic(request.user);
        
        response.status(200).json(logistics);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getById = async (request, response, next) => {
    
    try {

        const { id } = request.params;
    
        const logistic = await LogisticService.getLogisticById(id, request.user);
    
        response.status(200).json(logistic);
    
    } catch (error) { 
    
        next(error); 
    }
};

exports.getByUser = async (request, response, next) => {
    
    try {
    
        const { userId } = request.params;
    
        const logistic = await LogisticService.getLogisticByUser(userId, request.user);
    
        response.status(200).json(logistic);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getByStatus = async (request, response, next) => {
    
    try {
    
        const { status } = request.params;
    
        const logistics = await LogisticService.getLogisticByStatus(status, request.user);
    
        response.status(200).json(logistics);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getByEvent = async (request, response, next) => {
    
    try {
    
        const { eventId } = request.params;
        const logistics = await LogisticService.getEventById(eventId, request.user);
    
        response.status(200).json(logistics);
    
    } catch (error) {
    
        next(error);
    }
};

exports.create = async (request, response, next) => {
    
    try {

        const data = request.body;
        
        const addedLogistic = await LogisticService.createLogistic(data, request.user);
        
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'logistic',
            action: 'CREATE',
            payload: addedLogistic
        });

        response.status(201).json(addedLogistic);
    
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
    
        const updatedLogistic = await LogisticService.updateLogistic(id, data, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'logistic',
            action: 'UPDATE',
            payload: updatedLogistic
        });

        response.status(200).json(updatedLogistic);
    
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
    
        const updatedPartialLogistic = await LogisticService.updatePartialLogistic(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'logistic',
            action: 'UPDATE',
            payload: updatedPartialLogistic
        });

        response.status(200).json(updatedPartialLogistic);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updateStatus = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { status } = request.body;
        
        const updatedStatusLogistic = await LogisticService.updateLogisticStatus(id, status, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'logistic',
            action: 'UPDATE',
            payload: updatedStatusLogistic
        });

        const statusLogistic = {
            message: "Statut logistique mis à jour",
            item: updatedStatusLogistic
        };
        
        response.status(200).json(statusLogistic);
    
    } catch (error) {
        
        next(error);
    }
};

exports.delete = async (request, response, next) => {
    
    try {

        const { id } = request.params;
    
        const deletedLogistic = await LogisticService.deleteLogistic(id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'logistic',
            action: 'DELETE',
            payload: {id}
        });

        const logistic = { 
            message: "Logistic supprimée", 
            logistic: deletedLogistic 
        };
    
        response.status(200).json(logistic);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getCarbonImpact = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
    
        const calculateImpact = await LogisticService.calculateCarbonImpactLogistic(id);
    
        const impact = { 
            routeId: id, 
            carbonImpact: calculateImpact 
        };

        response.status(200).json(impact);
    
    } catch (error) {
    
        next(error);
    }
};