const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const { 
    itemSchemaValidation, 
    itemUpdateSchemaValidation, 
    itemStatusSchemaValidation 
} = require('../../shared_schemas/itemSchemaValidation');

const authentificationMiddleware = require('../middlewares/authentificationMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authentificationMiddleware, itemController.getAll);
router.get('/status/:status', authentificationMiddleware, roleMiddleware(['admin', 'superadmin']), itemController.getByStatus);

router.get('/:id', authentificationMiddleware, validationMiddleware(null, true), itemController.getById);

router.post('/', authentificationMiddleware, validationMiddleware(itemSchemaValidation, false), itemController.create);
router.put('/:id', authentificationMiddleware, validationMiddleware(itemUpdateSchemaValidation, true), itemController.update);
router.patch('/:id', authentificationMiddleware, validationMiddleware(itemUpdateSchemaValidation, true), itemController.updatePartial);

router.patch('/:id/status', authentificationMiddleware, validationMiddleware(itemStatusSchemaValidation, true), itemController.updateStatus);

router.delete('/:id', authentificationMiddleware, validationMiddleware(null, true), itemController.delete);

module.exports = router;