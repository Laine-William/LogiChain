const express = require('express');
const router = express.Router();

const anomalyController = require('../controllers/anomalyController');
const { 
    anomalySchemaValidation, 
    anomalyUpdateSchemaValidation, 
    anomalyStatusSchemaValidation,
    anomalySeveritySchemaValidation 
} = require('../../shared_schemas/anomalySchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/nearby', authentificationMiddleware, anomalyController.getNearby);

router.get('/', authentificationMiddleware, anomalyController.getAll);
router.get('/status/:status', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), anomalyController.getByStatus);
router.get('/severity/:severity', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), anomalyController.getBySeverity);

router.get('/event/:eventId', authentificationMiddleware, anomalyController.getByEvent);

router.get('/:id', authentificationMiddleware, validationMiddleware(null, true), anomalyController.getById);

router.post('/', authentificationMiddleware, validationMiddleware(anomalySchemaValidation, false), anomalyController.create);
router.put('/:id', authentificationMiddleware, validationMiddleware(anomalyUpdateSchemaValidation, true), anomalyController.update);
router.patch('/:id', authentificationMiddleware, validationMiddleware(anomalyUpdateSchemaValidation, true), anomalyController.updatePartial);

router.patch('/:id/status', authentificationMiddleware, validationMiddleware(anomalyStatusSchemaValidation, true), anomalyController.updateStatus);
router.patch('/:id/severity', authentificationMiddleware, validationMiddleware(anomalySeveritySchemaValidation, true), anomalyController.updateSeverity);

router.delete('/:id', authentificationMiddleware, validationMiddleware(null, true), anomalyController.delete);

module.exports = router;