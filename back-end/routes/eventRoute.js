const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const { 
    eventSchemaValidation, 
    eventUpdateSchemaValidation, 
    eventStatusSchemaValidation 
} = require('../../shared_schemas/eventSchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/stats', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), eventController.getDashboardStatistic);
router.get('/stats/users/:userId', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), eventController.getDashboardStatisticByUser);

router.get('/', authentificationMiddleware, eventController.getAll);
router.get('/status/:status', authentificationMiddleware, eventController.getByStatus);
router.get('/users/:userId', authentificationMiddleware, eventController.getByUser);

router.get('/:id', authentificationMiddleware, validationMiddleware(null, true), eventController.getById);

router.post('/', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), validationMiddleware(eventSchemaValidation, false), eventController.create);
router.put('/:id', authentificationMiddleware, validationMiddleware(eventUpdateSchemaValidation, false), eventController.update);
router.patch('/:id', authentificationMiddleware, validationMiddleware(eventUpdateSchemaValidation, false), eventController.updatePartial);

router.patch('/:id/status', authentificationMiddleware, validationMiddleware(eventStatusSchemaValidation, false), eventController.updateStatus);

router.delete('/:id', authentificationMiddleware, validationMiddleware(null, true), eventController.delete);

module.exports = router;