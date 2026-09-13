const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const { 
    userRegisterSchemaValidation, 
    userLoginSchemaValidation,
    userUpdateSchemaValidation, 
    userAvailabilitySchemaValidation,
    userAccountStatusSchemaValidation,
    forgotPasswordSchemaValidation,
    resetPasswordSchemaValidation
} = require('../../shared_schemas/userSchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const forgotPasswordMiddleware = require('../middlewares/forgotPasswordMiddleware');

// Routes publiques
router.post('/register', validationMiddleware(userRegisterSchemaValidation), userController.register);
router.post('/login', validationMiddleware(userLoginSchemaValidation), userController.login);

router.get('/verify-email', userController.verifyEmail);

router.post('/forgot-password', forgotPasswordMiddleware, validationMiddleware(forgotPasswordSchemaValidation), userController.forgotPassword);
router.post('/reset-password', validationMiddleware(resetPasswordSchemaValidation), userController.resetPassword);

// Routes protégées
router.get('/', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), userController.getAll);

router.get('/role/:role', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), userController.getByRole);
router.get('/account/:status', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), userController.getByAccountStatus);
router.get('/availability/:status', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), userController.getByAvailabilityStatus);

router.get('/:id', authentificationMiddleware, validationMiddleware(null, true), userController.getById);
router.put('/:id', authentificationMiddleware, validationMiddleware(userUpdateSchemaValidation, true), userController.update);
router.patch('/:id', authentificationMiddleware, validationMiddleware(userUpdateSchemaValidation, true), userController.updatePartial);

router.patch('/:id/availability', authentificationMiddleware, validationMiddleware(userAvailabilitySchemaValidation, true), userController.updateAvailability);
router.patch('/:id/status', authentificationMiddleware, validationMiddleware(userAccountStatusSchemaValidation, true), userController.updateAccountStatus);

router.delete('/:id', authentificationMiddleware, validationMiddleware(null, true), userController.delete);

module.exports = router;