const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const { 
    notificationTypeSchemaValidation 
} = require('../../shared_schemas/notificationSchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authentificationMiddleware, notificationController.getAll);
router.get('/user/:userId', authentificationMiddleware, notificationController.getByUser);
router.get('/type/:type', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), validationMiddleware(notificationTypeSchemaValidation, true), notificationController.getByType);

router.patch('/user/:userId/read/:notificationId', authentificationMiddleware, validationMiddleware(null, true), notificationController.markAsRead);
router.patch('/user/:userId/read-all', authentificationMiddleware, validationMiddleware(null, true), notificationController.markAllRead);

router.patch('/:notificationId/type', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), validationMiddleware(notificationTypeSchemaValidation, true), notificationController.updateType);

module.exports = router;