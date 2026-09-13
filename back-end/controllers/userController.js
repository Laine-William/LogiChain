const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { broadcast } = require('../utils/sse');

exports.getAll = async (request, response, next) => {

    try {

        const users = await UserService.getAllUser(request.user);

        response.status(200).json(users);

    } catch (error) { 
        
        next(error); 
    }
};

exports.getByRole = async (request, response, next) => {
    
    try {
    
        const { role } = request.params;
    
        const user = await UserService.getUserByRole(role, request.user);
    
        response.status(200).json(user);
    
    } catch (error) {
    
        next(error);
    }
};

exports.getById = async (request, response, next) => {
    
    try {

        const { id } = request.params;
    
        const user = await UserService.getUserById(id, request.user);
    
        response.status(200).json(user);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.getByAccountStatus = async (request, response, next) => {
    
    try {

        const { status } = request.params;
    
        const user = await UserService.getUserByAccountStatus(status, request.user);
    
        response.status(200).json(user);
    
    } catch (error) { 
    
        next(error); 
    }
};

exports.getByAvailabilityStatus = async (request, response, next) => {
    
    try {

        const { status } = request.params;

        const user = await UserService.getUserByAvailabilityStatus(status, request.user);
        
        response.status(200).json(user);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.register = async (request, response, next) => {

    try {

        const data = request.body;

        const addedUser = await UserService.registerUser(data);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'CREATE',
            payload: addedUser
        });

        const register = { 
            message: "Utilisateur créé avec succès", 
            id: addedUser.id 
        }

        response.status(201).json(register);

    } catch (error) {
    
        next(error);
    }
};

exports.login = async (request, response, next) => {
    
    try {

        const { email, password } = request.body;

        if (!email && !password) {
            return response.status(400).json({
                error: "Veuillez renseigner votre adresse e-mail et votre mot de passe."
            });
        }

        const data = await UserService.loginUser(email, password);

        const payload = { 
            id: data.id, 
            role: data.role 
        };

        // 3. Préparation des options de signature
        const secretKey = process.env.JWT_SECRET;
        const expirationTime = process.env.JWT_EXPIRES_IN;

        // 4. Génération du JWT
        const token = jwt.sign(payload, secretKey, {
            expiresIn: expirationTime 
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        // 5. Préparation de la réponse
        const login = {
            message: "Connexion réussie",
            token: token,
            user: data
        };

        return response.status(200).json(login);

    } catch (error) {

        next(error);
    }
};

exports.verifyEmail = async (request, response, next) => {
    
    try {

        const { email, code } = request.body;

        await UserService.verifyEmail(email, code);

        response.status(200).json({ 
            message: "Compte activé avec succès" 
        });

    } catch (error) { 
        
        next(error); 
    }
};

exports.forgotPassword = async (request, response, next) => {
    
    try {

        const { email } = request.body;

        await UserService.forgotPassword(email);

        response.status(200).json({ 
            message: "Si l'adresse e-mail existe, un lien de réinitialisation a été envoyé." 
        });

    } catch (error) { 
        
        next(error); 
    }
};

exports.resetPassword = async (req, res, next) => {
    
    try {
    
        const { email, code, newPassword } = req.body;
    
        await UserService.resetPassword(email, code, newPassword);
    
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    
    } catch (error) {
    
        next(error);
    }
};

const cleanFieldBody = (body) => {
    
    const cleanFieldBody = { ...body };
    
    ['__v', '_id', 'createdAt', 'updatedAt', 'isDeleted'].forEach(field => delete cleanFieldBody[field]);
    
    return cleanFieldBody;
};

exports.update = async (request, response, next) => {
    
    try {

        const { id } = request.params;
        const data = cleanFieldBody(request.body);

        const updatedUser = await UserService.updateUser(id, data, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'UPDATE',
            payload: updatedUser
        });

        response.status(200).json(updatedUser);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updatePartial = async (request, response, next) => {
    
    try {

        const { id } = request.params;
        const data = cleanFieldBody(request.body);

        if (Object.keys(data).length === 0) {
            
            const error_message = { message: `Aucune donnée fournie pour la mise à jour.`};

            return response.status(400).json(error_message);
        }

        const updatedPartialUser = await UserService.updatePartialUser(id, data, request.user);
    
        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'UPDATE',
            payload: updatedPartialUser
        });

        response.status(200).json(updatedPartialUser);
    
    } catch (error) { 
        
        next(error); 
    }
};

exports.updateAccountStatus = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { accountStatus } = request.body;

        const updatedUser = await UserService.updateAccountStatusUser(id, accountStatus, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'UPDATE',
            payload: updatedUser
        });

        const updateAccount = {
            message: "Statut du compte mis à jour",
            user: updatedUser
        };

        response.status(200).json(updateAccount);

    } catch (error) {
        
        next(error);
    }
};

exports.updateAvailability = async (request, response, next) => {
    
    try {
    
        const { id } = request.params;
        const { availability } = request.body;

        const updatedUser = await UserService.updateAvailabilityUser(id, availability, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'UPDATE',
            payload: updatedUser
        });

        const updateAvailability = {
            message: "Disponibilité mise à jour",
            user: updatedUser
        };

        response.status(200).json(updateAvailability);
    
    } catch (error) {
    
        next(error);
    }
};

exports.delete = async (request, response, next) => {
    
    try {

        const { id } = request.params;
    
        const deletedUser = await UserService.deleteUser(id, request.user);

        // Diffusion SSE
        broadcast('sync_update', {
            type: 'user',
            action: 'DELETE',
            payload: {id}
        });

        const message = "Utilisateur supprimé avec succès";
    
        response.status(200).json({ 
            message: message , 
            user: deletedUser 
        });
    
    } catch (error) { 
        
        next(error); 
    }
};