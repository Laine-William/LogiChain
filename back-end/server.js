const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const axios = require('axios');

const Env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(Env);
const application = require('./application');
const mongoose = require('mongoose');
const Logger = require('./utils/logger');

const PORT = process.env.PORT;

// Connexion BDD puis lancement serveur
const startServer = async () => {
    
    try {
        
        await mongoose.connect(process.env.MONGO_URI);

        const log = 'Connecté à la base de données';
        
        Logger.info(log);

        application.listen(PORT, '0.0.0.0', () => {

            const log = `Serveur démarré sur le port ${PORT}`;

            Logger.info(log);
        });
    
    } catch (error) {

        const log = 'Erreur critique au démarrage du serveur:';

        Logger.error(log, error);
        
        process.exit(1); // Arrêt forcé en cas d'échec critique (BDD indisponible)
    }
};

startServer();