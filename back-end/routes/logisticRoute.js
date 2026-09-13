const express = require('express');
const router = express.Router();

const logisticController = require('../controllers/logisticController');
const logisticSchema = require('../models/schemas/logisticSchema'); 

const { updateStatusLogisticSchemaValidation } = require('../../shared_schemas/logisticSchemaValidation');

const stepLogisticRoute = require('./stepLogisticRoute');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

router.get('/', authentificationMiddleware, logisticController.getAll);
router.get('/status/:status', authentificationMiddleware, logisticController.getByStatus);

router.get('/event/:eventId', authentificationMiddleware, logisticController.getByEvent);

router.get('/:id', authentificationMiddleware, validationMiddleware(null, true), logisticController.getById);

router.post('/', authentificationMiddleware, validationMiddleware(logisticSchema, false), logisticController.create);
router.put('/:id', authentificationMiddleware, validationMiddleware(logisticSchema, false), logisticController.update);
router.patch('/:id', authentificationMiddleware, validationMiddleware(logisticSchema, false), logisticController.updatePartial);

router.patch('/:id/status', authentificationMiddleware, validationMiddleware(updateStatusLogisticSchemaValidation, false), logisticController.updateStatus);

router.delete('/:id', authentificationMiddleware, validationMiddleware(null, true), logisticController.delete);

router.use('/:id/steps', stepLogisticRoute);

router.get('/:id/carbon-impact', authentificationMiddleware, logisticController.getCarbonImpact);

module.exports = router;