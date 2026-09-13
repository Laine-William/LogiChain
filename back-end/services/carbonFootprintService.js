const CustomError = require('../utils/customError');
const Logger = require('../utils/logger');

class CarbonFootprintService {
    // Constantes de configuration pour les facteurs d'émission
    static EMISSION_FACTORS = {
        truck: 0.8,
        ship: 0.1,
        plane: 2.5,
        train: 0.5
    };

    calculateEmission(distance, transportType = 'train') {

        if (distance === undefined || distance < 0) {

            const message = "La distance doit être un nombre positif.";
            
            Logger.error(`Tentative de calcul invalide: ${message} (Distance: ${distance})`);
            
            throw new CustomError(message, 400);
        }

        const type = transportType.toLowerCase();

        if (!CarbonFootprintService.EMISSION_FACTORS[type]) {
             
            const error_message = `Type de transport '${transportType}' inconnu.`;

            const log = `Tentative de calcul invalide: ${error_message}`;
            
            Logger.error(log);
            
            throw new CustomError(error_message, 400);
        }

        const factor = CarbonFootprintService.EMISSION_FACTORS[type] || CarbonFootprintService.EMISSION_FACTORS.train;
        
        // 2. Calcul du résultat
        const totalEmission = distance * factor;
        
        // 3. Arrondi pour la propreté des données
        const roundedEmission = parseFloat(totalEmission.toFixed(2));

        const log = `Calcul carbone réussi: ${roundedEmission}kg pour ${distance}km (${type})`;
        
        Logger.info(log);

        return roundedEmission;
    }
}

module.exports = new CarbonFootprintService();