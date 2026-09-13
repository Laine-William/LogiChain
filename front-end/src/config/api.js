// Configuration des URLs et des paramètres réseau pour l'API LogiChain
const ENV = {
  development: {
    API_BASE_URL: 'http://10.0.2.2:3000/api', // Adresse IP pour l'émulateur Android associé au localhost pour la BDD MongoDB
    WS_URL: 'ws://10.0.2.2:3000',
  },
  production: {
    API_BASE_URL: 'https://api.logichain-platform.com/api',
    WS_URL: 'wss://api.logichain-platform.com',
  }
};

// Bascule automatique selon l'environnement de build
const currentEnv = __DEV__ ? 'development' : 'production';

export const API_CONFIG = {
  BASE_URL: ENV[currentEnv].API_BASE_URL,
  WS_URL: ENV[currentEnv].WS_URL,
  TIMEOUT: 15000, // Timeout des requêtes HTTP en millisecondes
};