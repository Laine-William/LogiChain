const express = require('express');
const router = express.Router();
const axios = require('axios');
const Logger = require('../utils/logger');

router.get('/completion', async (req, res) => {
    const text = req.query.text;
    if (!text || text.length < 2) {
        return res.status(400).json({ error: "Le paramètre 'text' est requis." });
    }

    try {
        const url = `https://data.geopf.fr/geocodage/completion/?text=${encodeURIComponent(text)}&maximumResponses=5`;
        const response = await axios.get(url, { timeout: 5000 });
        res.json(response.data);
    } catch (error) {
        Logger.error("Erreur du service IGN :", error.message);
        res.status(503).json({ error: "Service de géocodage injoignable" });
    }
});

module.exports = router;