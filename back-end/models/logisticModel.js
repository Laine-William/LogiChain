const BaseEntity = require('./baseEntity');

class Logistic extends BaseEntity {

    constructor(data) {

        super(data);
        
        this.userId = data.userId || [];
        this.eventId = data.eventId || null;
        this.departureDestination = data.departureDestination;
        this.departurePosition = data.departurePosition;
        this.arrivalDestination = data.arrivalDestination;
        this.arrivalPosition = data.arrivalPosition;
        this.status = data.status;
        this.isDeleted = data.isDeleted || false;
        this.totalFuelConsumption = data.totalFuelConsumption || 0;
        this.totalDistance = data.totalDistance;
        this.steps = (data.steps || []).map(step => ({
            ...step,
            position: step.position,
            items: step.items || []
        }));
        this.statusHistory = data.statusHistory || [];
    }

    calculateCarbonImpactLogistic(carbonService) {

        const totalImpact = this.steps.reduce((accumulation, step) => {

            if (!step.distance || !step.vehicle) {

                return accumulation;
            }
            
            const emission = carbonService.calculateEmission(step.distance, step.vehicle)
            const carbonImpact = accumulation + emission;
        
            return carbonImpact;
        }, 0);
        
        const impact = parseFloat(totalImpact.toFixed(2));
                
        return impact;
    }
}

module.exports = Logistic;