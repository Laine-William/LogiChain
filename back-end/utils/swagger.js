const swaggerJsdoc = require('swagger-jsdoc');
const components = require('./swaggerComponents');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API LogiChain',
            version: '1.0.0',
            description: 'Documentation de l\'API Logistique LogiChain',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Serveur de développement' }
        ],
        components: {
            schemas: components,
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ BearerAuth: [] }],
    },
    apis: [
        './routes/*.js',
        './controllers/*.js',
        './docs/swagger/*.yaml'
    ], 
};

const swagger = swaggerJsdoc(options);

console.log('Routes trouvées par Swagger :', JSON.stringify(swagger.paths, null, 2));

module.exports = swagger;