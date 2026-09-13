const BaseService = require('./baseService');

const ItemRepository = require('../repositories/itemRepository');

const Logger = require('../utils/logger');

const {item_status} = require('../../shared_constants/constants');

const itemRepository = new ItemRepository();

// Ajout des statuts bloquants demandés
const lockedStatus = ['maintenance', 'archived', 'in_use'];
const allowTransitionStatus = {
    'available': ['in_use', 'maintenance', 'reserved', 'archived'],
    'in_use': ['available', 'maintenance', 'reserved', 'archived'],
    'maintenance': ['available', 'archived'],
    'reserved': ['available', 'in_use', 'maintenance', 'archived'],
    'archived': [] // État final
};

class ItemService extends BaseService {

    async getAllItem(requestUser) {

        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {

            const item = await itemRepository.findByUserId(requestUser.id);

            return item;
        }

        const items = await itemRepository.getAll();

        return items;
    }

    async getItemById(itemId, requestUser) {

        const item = await itemRepository.getById(itemId);

        this._validateNotFound(
            !item, 
            `Élément ${itemId} introuvable`
        );

        this._checkUserSecurity(item, requestUser);

        return item;
    }

    async getItemByStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);

        const validStatus = item_status;

        this._validateBadRequest(
            !validStatus.includes(status), 
            `Statut pour de l'élément invalide : ${status}`
        );
        
        const item = await itemRepository.findByStatus(status)

        return item;
    }

    async createItem(data, requestUser) {

        this._checkAccountStatus(requestUser);

        const createdItem = await itemRepository.create({ 
            ...data, 
            userId: requestUser.id 
        });

        return createdItem;
    }

    async updateItem(itemId, data, requestUser) {

        const item = await itemRepository.getById(itemId);

        this._validateNotFound(
            !item, 
            `Élément ${itemId} introuvable`
        );
        
        this._checkUserSecurity(item, requestUser);

        const updateData = { ...data };

        if (updateData.status) {
            if (updateData.status === item.status) {
                delete updateData.status;
            } else {
                this._validateBadRequest(true, `Modification interdite du statut`);
            }
        }

        this._validateConflict(
            lockedStatus.includes(item.status), 
            `Modification impossible pour : ${itemId} avec le statut : '${item.status}'.`
        );

        const isSameItem = Object.keys(updateData).every(key => item[key] === updateData[key]);

        this._validateConflict(
            isSameItem, 
            `Aucune modification, données identiques.`
        );

        const updatedItem = await itemRepository.update(itemId, updateData);
        
        return updatedItem;
    }

    async updatePartialItem(itemId, data, requestUser) {
        
        const item = await itemRepository.getById(itemId);

        this._validateNotFound(
            !item, 
            `Élément ${itemId} introuvable`
        );
        
        this._checkUserSecurity(item, requestUser);
        
        const updateData = { ...data };

        if (updateData.status) {
            if (updateData.status === item.status) {
                delete updateData.status;
            } else {
                this._validateBadRequest(true, `Modification interdite du statut`);
            }
        }

        this._validateConflict(
            lockedStatus.includes(item.status), 
            `Modification impossible, statut '${item.status}' verrouillé.`
        );

        const isSameItem = Object.keys(updateData).every(key => item[key] === updateData[key]);

        this._validateConflict(
            isSameItem, 
            `Aucune modification, données identiques.`
        );

        const updatedPartial = await itemRepository.updatePartial(itemId, updateData);
        
        return updatedPartial;
    }

    async updateItemStatus(itemId, newStatus, requestUser) {

        const item = await itemRepository.getById(itemId);

        this._validateNotFound(
            !item, 
            `Élément ${itemId} introuvable`
        );

        this._checkUserSecurity(item, requestUser);
    
        this._validateBadRequest(
            !newStatus, 
            `Le statut est requis pour l'élément`
        );
        
        this._validateConflict(
            item.status === newStatus, 
            `L'élément ${itemId} a déjà ce statut ${newStatus}`
        );

        const transitionStatus = allowTransitionStatus[item.status] || [];

        this._validateConflict(
            !transitionStatus.includes(newStatus), 
            `Changement interdit : impossible de passer de '${item.status}' à '${newStatus}'.`
        );

        const updatedItem = await itemRepository.updateStatus(itemId, newStatus);
        
        const log = `Statut mis à jour : élément ${itemId} -> ${newStatus}`;

        Logger.info(log);

        return updatedItem;
    }

    async deleteItem(itemId, requestUser) {

        const item = await itemRepository.getById(itemId);

        this._validateNotFound(
            !item, 
            `Élément ${itemId} introuvable`
        );

        this._checkUserSecurity(item, requestUser);

        this._validateConflict(
            lockedStatus.includes(item.status), 
            `Suppression impossible, statut '${item.status}' verrouillé.`
        );

        this._validateConflict(
            item.isDeleted, 
            `Élément ${itemId} a déjà été supprimée`
        );

        const deletedItem = await itemRepository.softDelete(itemId);

        return deletedItem;
    }
}

module.exports = new ItemService();