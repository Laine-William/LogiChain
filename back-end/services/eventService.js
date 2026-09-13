const BaseService = require('./baseService');

const EventRepository = require('../repositories/eventRepository');

const Logger = require('../utils/logger');

const {event_status} = require('../../shared_constants/constants');

const eventRepository = new EventRepository();

class EventService extends BaseService {

    _calculStatistic(zoneStatistic) {
    
        const totalEvents = zoneStatistic.reduce((sum, item) => sum + (item.totalEvents || 0), 0);

        const resultStatistic = {
            totalEvents,
            zone: zoneStatistic,
            generatedAt: new Date()
        };

        const log = `Statistiques générées à ${resultStatistic.generatedAt.toISOString()}`;

        Logger.info(log);

        return resultStatistic;
    }
    
    async getGlobalStatistic(requestUser) {

        this._checkAdminAccess(requestUser);
        
        const zoneStatistic = await eventRepository.getDashboardStatistic();
            
        const calculStatistic = this._calculStatistic(zoneStatistic);

        return calculStatistic;
    }

    async getStatisticByUser(userId, requestUser) {

        this._checkUserSecurity(userId, requestUser);

        const zoneStatistic = await eventRepository.getDashboardStatisticByUser(userId);
            
        const calculStatistic = this._calculStatistic(zoneStatistic);

        return calculStatistic;
    }

    async getAllEvent(requestUser) {

        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {
        
            const event = await eventRepository.findByUserId(requestUser.id);

            return event;
        }
        
        const events = await eventRepository.getAll(requestUser);

        return events;
    }

    async getEventById(eventId, requestUser) {

        const event = await eventRepository.getById(eventId);
        
        this._validateNotFound(
            !event, 
            `Événement ${eventId} introuvable`
        );
        
        this._checkUserSecurity(event, requestUser);

        return event;
    }
 
    async getEventByUser(userId, requestUser) {
    
        const event = await eventRepository.findByUserId(userId);
        
        this._validateNotFound(
            !event || event.length === 0, 
            `Aucun évènement trouvé pour l'utilisateur ${userId}.`
        );

        this._checkUserSecurity(event, requestUser);
        
        return event;
    }

    async getEventByStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);

        const validStatus = event_status;

        this._validateBadRequest(
            !validStatus.includes(status), 
            `Statut pour l'évènement invalide : ${status}`
        );
        
        const event = await eventRepository.findByStatus(status)

        return event;
    }

    async createEvent(data, requestUser) {

        this._checkAdminAccess(requestUser);

        const createdEvent = await eventRepository.create({ 
            ...data, 
            userId: requestUser.id 
        });

        return createdEvent;
    }

    async updateEvent(eventId, data, requestUser) {

        const event = await eventRepository.getById(eventId);
        
        this._validateNotFound(
            !event, 
            `Événement ${eventId} introuvable`
        );
        
        this._checkUserSecurity(event, requestUser);

        const isSameEvent = Object.keys(data).every(key => event[key] === data[key]);

        this._validateConflict(
            isSameEvent, 
            `Aucune modification, données identiques.`
        );

        const updatedEvent = await eventRepository.update(eventId, data);

        return updatedEvent;
    }

    async updatePartialEvent(eventId, data, requestUser) {

        const event = await eventRepository.getById(eventId);
        
        this._validateNotFound(
            !event, 
            `Événement ${eventId} introuvable`
        );
        
        this._checkUserSecurity(event, requestUser);
        
        const isSameEvent = Object.keys(data).every(key => event[key] === data[key]);

        this._validateConflict(
            isSameEvent, 
            `Aucune modification, données identiques.`
        );

        const updatedPartial = await eventRepository.updatePartial(eventId, data);
        
        return updatedPartial;
    }

    async updateEventStatus(eventId, newStatus, requestUser) {

        const event = await eventRepository.getById(eventId);
        
        this._validateNotFound(
            !event, 
            `Événement ${eventId} introuvable`
        );
        
        this._checkUserSecurity(event, requestUser);
    
        this._validateBadRequest(
            !newStatus, 
            `Le statut de l'évènement est requis`
        );
        
        this._validateConflict(
            event.status === newStatus, 
            `L'évènement ${eventId} a déjà ce statut ${newStatus}`
        );

        const updatedEvent = await eventRepository.updateStatus(eventId, newStatus);
        
        const log = `Statut mis à jour : évènement ${eventId} -> ${newStatus}`;

        Logger.info(log);

        return updatedEvent;
    }

    async deleteEvent(eventId, requestUser) {

        const event = await eventRepository.getById(eventId);
        
        this._validateNotFound(
            !event, 
            `Événement ${eventId} introuvable`
        );
        
        this._checkUserSecurity(event, requestUser);

        this._validateConflict(
            event.isDeleted, 
            `Événement ${eventId} a déjà été supprimé`
        );

        const deletedEvent = await eventRepository.softDelete(eventId);

        return deletedEvent;
    }
}

module.exports = new EventService();