const NotificationService = require('../services/notificationService');
const { broadcast } = require('../utils/sse');

exports.getAll = async (request, response, next) => {

    try {
    
        const notifications = await NotificationService.getAllNotification(request.user);
    
        response.status(200).json(notifications);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getByUser = async (request, response, next) => {
    
    try {
    
        const { userId } = request.params;  

        const notification = await NotificationService.getNotificationByUser(userId, request.user);
    
        response.status(200).json(notification);
    
    } catch (error) { 
        
        next(error); }
};

exports.getByType = async (request, response, next) => {
    
    try {
    
        const { type } = request.params;  

        const notification = await NotificationService.getNotificationByType(type, request.user);
        
        response.status(200).json(notification);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updateType = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;  
        const type = request.body;
        
        const updatedNotification = await NotificationService.updateNotificationType(id, type, request.user);
        
        const statusNotification = {
            message: `Type de notification mise à jour`,
            item: updatedNotification
        };

        response.status(200).json(statusNotification);

    } catch (error) { 
        
        next(error); 
    }
};

exports.markAsRead = async (request, response, next) => {

    try {

        const { id, userId } = request.params;  

        const updatedOneNotification = await NotificationService.markNotificationAsRead(userId, id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'notification',
            action: 'UPDATE',
            payload: updatedOneNotification
        });

        response.status(200).json(updatedOneNotification);

    } catch (error) { 
        
        next(error); 
    }
};

exports.markAllRead = async (request, response, next) => {

    try {

        const { userId } = request.params;  
        
        const updatedAllNotification = await NotificationService.markAllNotificationAsRead(userId, request.user);
        
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'notification',
            action: 'UPDATE_ALL',
            payload: updatedAllNotification
        });

        response.status(200).json(updatedAllNotification);

    } catch (error) { 
        
        next(error); 
    }
};