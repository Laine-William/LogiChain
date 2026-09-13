const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swagger = require('./utils/swagger');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const application = express();

// 1. Importation de vos nouveaux middlewares
const validationMiddleware = require('./middlewares/validationMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { handleSSEConnection } = require('./utils/sse');

// Middlewares globaux
application.use(express.json());
application.use(cors());
application.use(cookieParser());
application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

// Route SSE
application.get('/api/stream', handleSSEConnection);

// 2. Enregistrement des routes avec protection sélective
// Les routes publiques (pas de middleware ici)
application.use('/api/users', require('./routes/userRoute'));
application.use('/api/anomalies', require('./routes/anomalyRoute'));
application.use('/api/events', require('./routes/eventRoute'));
application.use('/api/items', require('./routes/itemRoute'));
application.use('/api/logistics', require('./routes/logisticRoute'));
application.use('/api/notifications', require('./routes/notificationRoute'));
application.use('/api/geocoding', require('./routes/geocodingRoute'));

// 3. Gestion globale des erreurs (Doit être en toute fin)
application.use(errorMiddleware);

module.exports = application;