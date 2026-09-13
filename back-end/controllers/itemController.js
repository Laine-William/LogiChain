const ItemService = require('../services/itemService');
const { broadcast } = require('../utils/sse');

exports.getAll = async (request, response, next) => {
    
    try {
    
        const items = await ItemService.getAllItem(request.user);
    
        response.status(200).json(items);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getById = async (request, response, next) => {
    
    try {

        const { id } = request.params;
    
        const item = await ItemService.getItemById(id, request.user);
    
        response.status(200).json(item);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getByStatus = async (request, response, next) => {
    
    try {
    
        const { status } = request.params;
    
        const item = await ItemService.getItemByStatus(status, request.user);
    
        response.status(200).json(item);
    
    } catch (error) {
    
        next(error);
    }
};

exports.create = async (request, response, next) => {
    
    try {

        const data = request.body;
    
        const addedItem = await ItemService.createItem(data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'item',
            action: 'CREATE',
            payload: addedItem
        });

        response.status(201).json(addedItem);
    
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
    
        const updatedItem = await ItemService.updateItem(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'item',
            action: 'UPDATE',
            payload: updatedItem
        });

        response.status(200).json(updatedItem);
    
    } catch (error) {
    
        next(error);
    }
};

exports.updatePartial = async (request, response, next) => {
    
    try {

        const { id } = request.params;
        const data = cleanBody(request.body);

        if (Object.keys(updateData).length === 0) {
            
            const error_message = { message: `Aucune donnée fournie pour la mise à jour.`};

            return response.status(400).json(error_message);
        }
    
        const updatedPartialItem = await ItemService.updatePartialItem(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'item',
            action: 'UPDATE',
            payload: updatedPartialItem
        });

        response.status(200).json(updatedPartialItem);
    
    } catch (error) {
    
        next(error);
    }
};

exports.updateStatus = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { status } = request.body;
        
        const updatedStatusItem = await ItemService.updateItemStatus(id, status, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'item',
            action: 'UPDATE',
            payload: updatedStatusItem
        });

        const statusItem = {
            message: `Statut de l'item mis à jour`,
            item: updatedStatusItem
        };
        
        response.status(200).json(statusItem);
    
    } catch (error) {
        
        next(error);
    }
};

exports.delete = async (request, response, next) => {
    
    try {

        const { id } = request.params;
 
        const deletedItem = await ItemService.deleteItem(id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'item',
            action: 'DELETE',
            payload: {id}
        });

        const item = {
            message: `Item supprimé`, 
            item: deletedItem 
        }
    
        response.status(200).json(item);
    
    } catch (error) {
    
        next(error);
    }
};