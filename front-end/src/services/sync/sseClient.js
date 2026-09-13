import { API_CONFIG } from '../../config/apiConfig';
import EventSource from 'react-native-sse';

class SSEClient {
  constructor() {
    this.eventSource = null;
  }

  connect(onMessageCallback, onErrorCallback) {
    // Connexion au flux SSE de l'API LogiChain
    const sseUrl = `${API_CONFIG.BASE_URL}/notifications/stream`;

    try {
      // Note: React Native nécessite parfois un polyfill pour EventSource (ex: 'react-native-sse')
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (onMessageCallback) onMessageCallback(parsedData);
        } catch (err) {
          console.error('Erreur lors du parsing du message SSE', err);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Erreur de connexion SSE (Alertes temps réel)', error);
        if (onErrorCallback) onErrorCallback(error);
      };

      console.log('Connecté au flux SSE LogiChain.');
    } catch (error) {
      console.error("Impossible d'initialiser le client SSE", error);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Déconnecté du flux SSE.');
    }
  }
}

export default new SSEClient();