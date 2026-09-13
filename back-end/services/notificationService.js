const axios = require('axios');

const BaseService = require('./baseService');

const NotificationRepository = require('../repositories/notificationRepository');

const CustomError = require('../utils/customError');
const Logger = require('../utils/logger');

const {notification_types} = require('../../shared_constants/constants');

const notificationRepository = new NotificationRepository();

class NotificationService extends BaseService {

    constructor() {

        super();

        this.apiKey = process.env.NOTIFICATION_API_KEY;
        this.baseUrl = process.env.NOTIFICATION_API_URL;
    }
    
    async send(userId, message, type = 'system', requestUser) {

        this._checkAccountStatus(requestUser);

        try {

            const response = await axios.post(`${this.baseUrl}/send`, {
                recipient: userId, 
                content: message, 
                channel: type
            }, 
            { headers: 
                { 'Authorization': `Bearer ${this.apiKey}` } 
            });

            const notification = await notificationRepository.create({
                userId, 
                message, 
                type, 
                externalReference: response.data.id
            });

            const log = `Notification envoyée (ID: ${notification.id})`;

            Logger.info(log);

            return notification;

        } catch (error) {

            const log = `[NotificationService] Échec envoi : ${error.message}`;

            Logger.error(log);

            const error_message = `Service de notification indisponible.`;

            throw new CustomError(error_message, 503);
        }
    }

    async getAllNotification(requestUser) {

        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {

            const notification = await notificationRepository.findByUserId(requestUser.id);

            return notification;
        }

        const notifications = await notificationRepository.getAll();

        return notifications;
    }

    async getNotificationByUser(userId, requestUser) {

        const notification = await notificationRepository.findByUserId(userId);

        this._validateNotFound(
            !notification || notification.length === 0, 
            `Notification de l'utilisateur : ${userId} introuvable.`
        );

        this._checkUserSecurity(notification, requestUser);

        return notification;
    }

    async getNotificationByType(type, requestUser) {

        this._checkAdminAccess(requestUser);

        const validType = notification_types;
        
        this._validateBadRequest(
            !validType.includes(type), 
            `Type de notification invalide`
        );

        const notification = await notificationRepository.findByType(type);

        this._validateNotFound(
            !notifications || notifications.length === 0,
            `Aucune notification trouvée pour le type : ${type}`
        );

        return notification;
    }

    async updateNotificationType(notificationId, newType, requestUser) {

        const notification = await notificationRepository.getById(notificationId);

        this._validateNotFound(
            !notification, 
            `Notification ${notificationId} introuvable`
        );

        this._checkUserSecurity(notification, requestUser);

        this._validateBadRequest(
            !newType, 
            `Le statut pour le type est requis`
        );
        
        this._validateConflict(
            notification.type === newType, 
            `La notification ${notificationId} a déjà ce statut ${newType}`
        );
        
        const updatedNotification = await notificationRepository.updateType(notificationId, newType);

        return updatedNotification;
    }

    async markNotificationAsRead(userId, notificationId, requestUser) {

        const notification = await notificationRepository.findById(notificationId);

        this._validateNotFound(
            !notification, 
            `Notification ${notificationId} introuvable.`
        );

        this._checkUserSecurity(notification, requestUser);

        this._validateBadRequest(
            notification.isRead === true, 
            `Notification ${notificationId} a déjà été marquée comme lue.`
        );

        const updatedNotification = await notificationRepository.markAsRead(notificationId);

        const log = `Notification ${notificationId} marquée comme lue par l'utilisateur ${userId}`;

        Logger.info(log)

        return updatedNotification;
    }

    async markAllNotificationAsRead(userId, requestUser) {

        const notifications = await notificationRepository.findByUserId(userId);
        
        this._validateNotFound(
            !notifications || notifications.length === 0, 
            `Aucune notification trouvée pour l'utilisateur ${userId}`
        );

        this._checkUserSecurity(notifications, requestUser);

        const updatedNotification = await notificationRepository.markAllAsRead(userId);

        return updatedNotification;
    }
}

module.exports = new NotificationService();