const express = require('express');
const router = express.Router({ mergeParams: true });

const stepLogisticController = require('../controllers/stepLogisticController');

const { 
    stepSchemaValidation,
    updateStepSchemaValidation,
    updateStepStatusSchemaValidation
 } = require('../../shared_schemas/logisticSchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

router.get('/', authentificationMiddleware, stepLogisticController.getAllStep);
router.get('/status/:status', authentificationMiddleware, stepLogisticController.getStepByStatus);

router.get('/:stepId', authentificationMiddleware, validationMiddleware(null, true), stepLogisticController.getStepById);

router.post('/', authentificationMiddleware, validationMiddleware(stepSchemaValidation, false), stepLogisticController.addStep);
router.put('/:stepId', authentificationMiddleware, validationMiddleware(updateStepSchemaValidation, false), stepLogisticController.updateStep);
router.patch('/:stepId', authentificationMiddleware, validationMiddleware(updateStepSchemaValidation, false), stepLogisticController.updatePartialStep);

router.patch('/:stepId/status', authentificationMiddleware, validationMiddleware(updateStepStatusSchemaValidation, false), stepLogisticController.updateStatusStep);

router.delete('/:stepId', authentificationMiddleware, validationMiddleware(null, true), stepLogisticController.deleteStep);

module.exports = router;