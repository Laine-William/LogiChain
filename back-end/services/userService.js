const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BaseService = require('./baseService');

const UserRepository = require('../repositories/userRepository');

const CustomError = require('../utils/customError');
const Logger = require('../utils/logger');

const {user_roles, user_accountStatus, user_availabilityStatus} = require('../../shared_constants/constants');

const { 
    sendPasswordResetEmail, 
    sendVerificationEmail 
} = require('../utils/mailerGoogle');

const userRepository = new UserRepository();

class UserService extends BaseService {

    async getAllUser(requestUser) {

        this._checkAccountStatus(requestUser);

        if (!this._isAdmin(requestUser)) {
        
            const user = await userRepository.getById(requestUser.id);
        
            if (user) {
            
                return [user];
            
            } else {
            
                return [];
            }
        }

        const users = await userRepository.getAll();

        return users;
    }

    async getUserById(userId, requestUser) {

        const user = await userRepository.getById(userId);

        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );


        this._checkUserSecurity(user, requestUser);

        return user;
    }

    async getUserByRole(role, requestUser) {

        this._checkAdminAccess(requestUser);

        const validRole = user_roles;

        this._validateBadRequest(
            !validRole.includes(role), 
            `Le rôle : '${role}' est invalide`
        );
        
        const users = await userRepository.findByRole(role);
        
        this._validateNotFound(
            !users || users.length === 0, 
            `Aucun utilisateur trouvé avec le rôle : ${role}`
        );

        return users;
    }

    async getUserByAccountStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);
     
        const validAccountStatus = user_accountStatus;

        this._validateBadRequest(
            !validAccountStatus.includes(status), 
            `Statut du compte invalide : ${status}`
        );
        
        const users = await userRepository.findByAccountStatus(status);
        
        return users;
    }

    async getUserByAvailabilityStatus(status, requestUser) {

        this._checkAdminAccess(requestUser);

        const validAvailableStatus = user_availabilityStatus;

        this._validateBadRequest(
            !validAvailableStatus.includes(status), 
            `Sattut pour la disponibilité invalide : ${status}`
        );
        
        const users = await userRepository.findByAvailabilityStatus(status);
        
        return users;
    }

    async loginUser(email, password) {

        const user = await userRepository.findByEmail(email);

        const passwordValid = await bcrypt.compare(password, user.password);

        this._validateBadRequest(
            !user || !passwordValid,
            'Identifiants invalides'
        );

        this._validateBadRequest(
            user.accountStatus === 'suspended', 
            'Votre compte est suspendu. Contactez un administrateur.'
        );
        
        this._validateBadRequest(
            user.accountStatus === 'pending', 
            'Votre compte est en attente de validation.'
        );

        const userData = { 
            id: user.id,
            role: user.role,
            email: user.email,
            fullName: user.fullName,
            accountStatus: user.accountStatus,
            availabilityStatus: user.availabilityStatus || 'offline' 
        };

        Logger.info(`Utilisateur connecté : ${email}`);
        
        return userData;
    }

    async registerUser(userData) {

        const { email, password } = userData;
        const saltRounds = 10;

        const existingUser = await userRepository.findByEmail(email);
        
        this._validateConflict(
            existingUser, 
            `Cet email est déjà utilisé`
        );

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Génération d'un code de vérification à 6 chiffres (valable 24h)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const userDataToSave = { 
            ...userData, 
            password: hashedPassword,
            accountStatus: 'pending',
            verificationCode,
            verificationCodeExpires: codeExpires
        };

        const newUser = await userRepository.create(userDataToSave);
        
        let userResponse;
        
        if (typeof newUser.toObject === 'function') {
        
            userResponse = newUser.toObject();
        
        } else {

            userResponse = { ...newUser };
        }

        delete userResponse.password;

        await sendVerificationEmail(userResponse.email, verificationCode);

        const log = `Nouvel utilisateur enregistré et code de validation envoyé : ${email}`;

        Logger.info(log);

        return userResponse;
    }

    async verifyEmail(email, code) {

        const user = await userRepository.findByEmail(email);

        this._validateNotFound(
            !user, 
            "Utilisateur introuvable"
        );

        this._validateBadRequest(
            !user.verificationCode || user.verificationCode !== code,
            "Code de validation invalide"
        );

        this._validateBadRequest(
            user.verificationCodeExpires && new Date() > new Date(user.verificationCodeExpires),
            "Le code de validation a expiré"
        );

        // Activation du compte et nettoyage des champs de vérification
        await userRepository.updatePartial(user.id, { 
            accountStatus: 'active',
            verificationCode: null,
            verificationCodeExpires: null
        });

        const log = `Compte activé avec succès pour l'utilisateur : ${user.email}`;

        Logger.info(log);
    }

    async forgotPassword(email) {

        const user = await userRepository.findByEmail(email);
        
        if (!user) {

            const log = `Tentative de réinitialisation pour un email inconnu : ${email}`;

            Logger.info(log);
        
            return; 
        }

        // Génération d'un code aléatoire à 6 chiffres
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Stockage du code et de son expiration en base (15 minutes)
        const codeExpires = new Date(Date.now() + 15 * 60 * 1000);
        await userRepository.updatePartial(user.id, { 
            resetPasswordCode: resetCode, 
            resetPasswordExpires: codeExpires 
        });

        // Envoi de l'e-mail avec le code à 6 chiffres
        await sendPasswordResetEmail(user.email, resetCode);

        const log = `Code de réinitialisation généré pour l'email : ${email}`;

        Logger.info(log);
    }

    async resetPassword(email, code, newPassword) {

        const user = await userRepository.findByEmail(email);

        this._validateNotFound(
            !user, 
            "Utilisateur introuvable"
        );

        // Vérification du code à 6 chiffres et de sa validité temporelle
        this._validateBadRequest(
            !user.resetPasswordCode || user.resetPasswordCode !== code,
            "Code de réinitialisation invalide"
        );

        this._validateBadRequest(
            user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires),
            "Le code a expiré"
        );

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Mise à jour du mot de passe et nettoyage des champs de réinitialisation
        await userRepository.updatePartial(user.id, { 
            password: hashedPassword,
            resetPasswordCode: null,
            resetPasswordExpires: null
        });

        const log = `Mot de passe réinitialisé avec succès pour : ${email}`;
        Logger.info(log);
    }

    async updateUser(userId, data, requestUser) {

        const user = await userRepository.getById(userId);
        
        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );

        this._checkUserSecurity(user, requestUser);

        if (data.role && !this._isAdmin(requestUser)) {

            const error_message = `Modification impossible`;

            throw new CustomError(error_message, 403);
        }

        const isSameUser = Object.keys(data).every(key => user[key] === data[key]);

        this._validateConflict(
            isSameUser, 
            `Aucune modification, données identiques.`
        );

        const updatedUser = await userRepository.update(userId, data);
 
        return updatedUser;
    }

    async updatePartialUser(userId, data, requestUser) {

        const user = await userRepository.getById(userId);
        
        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );
        
        this._checkUserSecurity(user, requestUser);

        if (data.role && !this._isAdmin(requestUser)) {

            const error_message = `Modification impossible`;

            throw new CustomError(error_message, 403);
        }

        const isSameUser = Object.keys(data).every(key => user[key] === data[key]);

        this._validateConflict(
            isSameUser, 
            `Aucune modification, données identiques.`
        );

        const updatePartialUser = await userRepository.updatePartial(userId, data);
        
        return updatePartialUser;
    }

    async updateAccountStatusUser(userId, accountStatus, requestUser) {

        const user = await userRepository.getById(userId);

        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );

        this._checkUserSecurity(user, requestUser);
        
        const validStatus = user_accountStatus;

        this._validateBadRequest(
            !validStatus.includes(accountStatus), 
            `Statut du compte invalide : ${accountStatus}`
        );
 
        this._validateConflict(
            user.accountStatus === accountStatus, 
            `Le statut : '${accountStatus}'`
        );

        const updatedUser = await userRepository.updatePartial(userId, { accountStatus });
        
        const log = `Statut du compte utilisateur ${userId} mis à jour : ${accountStatus}`;

        Logger.info(log);

        return updatedUser;
    }

    async updateAvailabilityUser(userId, availability, requestUser) {
        
        const user = await userRepository.getById(userId);

        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );
        
        this._checkUserSecurity(user, requestUser);

        const validAvailability = user_availabilityStatus;
        
        this._validateBadRequest(
            !validAvailability.includes(availability), 
            `État de ${availability} invalide`
        );
        
        this._validateConflict(
            user.availability === availability, 
            `L'utilisateur : '${availability}'`
        );

        const updatedUser = await userRepository.updatePartial(userId, { availabilityStatus: availability });
        
        if (!updatedUser) {

            const error_message = `Utilisateur ${userId} introuvable`;

            throw new CustomError(error_message, 404);
        }

        const log = `Utilisateur ${userId} : ${availability}`;

        Logger.info(log);

        return updatedUser;
    }

    async deleteUser(userId, requestUser) {
        
        const user = await userRepository.getById(userId);
        
        this._validateNotFound(
            !user, 
            `Utilisateur ${userId} introuvable`
        );
        
        this._checkUserSecurity(user, requestUser);

        this._validateConflict(
            user.isDeleted, 
            `Utilisateur ${userId} a déjà été supprimé`
        );

        const deletedUser = await userRepository.softDelete(userId);

        return deletedUser;
    }
}

module.exports = new UserService();