const EventService = require('../services/eventService');
const { broadcast } = require('../utils/sse');

exports.getDashboardStatistic = async (request, response, next) => {
    
    try {
    
        const statistic = await EventService.getGlobalStatistic(request.user);
        
        response.status(200).json(statistic);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getDashboardStatisticByUser = async (request, response, next) => {
    
    try {

        const { userId } = request.params;
    
        const statistic = await EventService.getStatisticByUser(userId, request.user);
        
        response.status(200).json(statistic);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getAll = async (request, response, next) => {
    
    try {
    
        const events = await EventService.getAllEvent(request.user);
    
        response.status(200).json(events);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getById = async (request, response, next) => {
    
    try {

        const { id } = request.params;
        
        const event = await EventService.getEventById(id, request.user);
        
        response.status(200).json(event);
        
    } catch (error) {
        
        next(error);
    }
};

exports.getByUser = async (request, response, next) => {
    
    try {
    
        const { userId } = request.params;
    
        const event = await EventService.getEventByUser(userId, request.user);
    
        response.status(200).json(event);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getByStatus = async (request, response, next) => {
    
    try {
    
        const { status } = request.params;
    
        const event = await EventService.getEventByStatus(status, request.user);
    
        response.status(200).json(event);
    
    } catch (error) {
    
        next(error);
    }
};

exports.create = async (request, response, next) => {
    
    try {

        const data = request.body;
    
        const addedEvent = await EventService.createEvent(data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'event',
            action: 'CREATE',
            payload: addedEvent
        });

        response.status(201).json(addedEvent);
    
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

        const updatedEvent = await EventService.updateEvent(id, data, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'event',
            action: 'UPDATE',
            payload: updatedEvent
        });

        response.status(200).json(updatedEvent);

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

        const updatedPartialEvent = await EventService.updatePartialEvent(id, data, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'event',
            action: 'UPDATE',
            payload: updatedPartialEvent
        });

        response.status(200).json(updatedPartialEvent);

    } catch (error) {

        next(error);
    }
};


exports.updateStatus = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { status } = request.body;
        
        const updatedStatusEvent = await EventService.updateEventStatus(id, status, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'event',
            action: 'UPDATE',
            payload: updatedStatusEvent
        });

        const statusEvent = {
            message: `Événement mis à jour`,
            item: updatedStatusEvent
        };
        
        response.status(200).json(statusEvent);
    
    } catch (error) {
        
        next(error);
    }
};

exports.delete = async (request, response, next) => {

    try {

        const { id } = request.params;

        const deletedEvent = await EventService.deleteEvent(id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'event',
            action: 'DELETE',
            payload: {id}
        });

        const event = {
            message: `Événement supprimée`, 
            event: deletedEvent 
        }

        response.status(200).json(event);

    } catch (error) {

        next(error);
    }
};
