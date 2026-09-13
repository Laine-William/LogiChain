const StepLogisticService = require('../services/stepLogisticService');
const LogisticService = require('../services/logisticService');
const { broadcast } = require('../utils/sse');

exports.getAllStep = async (request, response, next) => {

    try {
        
        const { id } = request.params;
        
        const steps = await StepLogisticService.getAllStepLogistic(id, request.user);
        
        response.status(200).json(steps);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getStepById = async (request, response, next) => {
    
    try {

        const { id, stepId } = request.params;
        
        const anomaly = await StepLogisticService.getStepLogisticById(id, stepId, request.user);
        
        response.status(200).json(anomaly);
        
    } catch (error) {
        
        next(error);
    }
};

exports.getStepByStatus = async (request, response, next) => {
    
    try {
    
        const { id, status } = request.params;
    
        const steps = await StepLogisticService.getStepLogisticByStatus(id, status, request.user);
    
        response.status(200).json(steps);
    
    } catch (error) { 
    
        next(error); 
    }
};

exports.addStep = async (request, response, next) => {

    try {
    
        const { id } = request.params;       
        const data = request.body;
        
        const addedStepLogistic = await LogisticService.updateLogisticProgress(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'step_logistic',
            action: 'UPDATE',
            payload: { 
                routeId: id, 
                step: addedStepLogistic 
            }
        });

        response.status(200).json(addedStepLogistic);
    
    } catch (error) {
    
        next(error);
    }
};

const cleanBody = (body) => {
    
    const cleanFieldBody = { ...body };
    
    ['__v', '_id', 'createdAt', 'updatedAt', 'isDeleted'].forEach(field => delete cleanFieldBody[field]);
    
    return cleanFieldBody;
};

exports.updateStep = async (request, response, next) => {
    
    try {

        const { id, stepId } = request.params;       
        const data = cleanBody(request.body);
    
        const updatedStepLogistic = await StepLogisticService.updateStepLogistic(id, stepId, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'step_logistic',
            action: 'UPDATE',
            payload: { 
                routeId: id, 
                step: updatedStepLogistic 
            }
        });

        response.status(200).json(updatedStepLogistic);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updatePartialStep = async (request, response, next) => {
    
    try {

        const { id, stepId } = request.params;          
        const data = cleanBody(request.body);

        if (Object.keys(data).length === 0) {
            
            const error_message = { message: `Aucune donnée fournie pour la mise à jour.`};

            return response.status(400).json(error_message);
        }
    
        const updatedPartialStepLogistic = await StepLogisticService.updatePartialStepLogistic(id, stepId, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'step_logistic',
            action: 'UPDATE',
            payload: { 
                routeId: id, 
                step: updatedPartialStepLogistic 
            }
        });

        response.status(200).json(updatedPartialStepLogistic);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updateStatusStep = async (request, response, next) => {
    
    try {
    
        const { id, stepId } = request.params;  
        const data = request.body;
        
        const updatedStatusStepLogistic = await StepLogisticService.updateStatusStepLogistic(id, stepId, data, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'step_logistic',
            action: 'UPDATE',
            payload: { 
                routeId: id, 
                step: updatedStatusStepLogistic 
            }
        });

        const statusStepLogistic = {
            message: "Statut de l'étape logistique mise à jour",
            item: updatedStatusStepLogistic
        };
        
        response.status(200).json(statusStepLogistic);
    
    } catch (error) {
        
        next(error);
    }
};

exports.deleteStep = async (request, response, next) => {
    
    try {

        const { id, stepId } = request.params;  

        const deletedStepLogistic = await StepLogisticService.deleteStepLogistic(id, stepId, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'step_logistic',
            action: 'DELETE',
            payload: { 
                routeId: id, 
                stepId: stepId 
            }
        });

        const stepLogistic = { 
            message: "Étape logistique supprimée", 
            step: deletedStepLogistic 
        };
        
        response.status(200).json(stepLogistic);
    
    } catch (error) { 
        
        next(error); 
    }
};