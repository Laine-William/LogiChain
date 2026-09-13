// services/sseService.js
let clients = [];

/**
 * Gère l'établissement de la connexion SSE avec un client
 */
const handleSSEConnection = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    console.log(`🔌 Client SSE connecté : ${clientId} (Total actifs : ${clients.length})`);

    // Envoi d'un battement de cœur (ping) toutes les 30s pour éviter les déconnexions par timeout
    const keepAliveInterval = setInterval(() => {
        res.write(': ping\n\n');
    }, 30000);

    // Nettoyage lors de la fermeture de la connexion par le client
    req.on('close', () => {
        clearInterval(keepAliveInterval);
        clients = clients.filter(client => client.id !== clientId);
        console.log(`🔌 Client SSE déconnecté : ${clientId} (Total actifs : ${clients.length})`);
    });
};

// Diffuse un événement à l'ensemble des clients connectés
const broadcast = (eventType, data) => {
    clients.forEach(client => {
        client.res.write(`event: ${eventType}\n`);
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};

module.exports = {
    handleSSEConnection,
    broadcast
};