const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const User = require('../models/schemas/userSchema');
const Notification = require('../models/schemas/notificationSchema');
const Item = require('../models/schemas/itemSchema');
const Anomaly = require('../models/schemas/anomalySchema');
const Event = require('../models/schemas/eventSchema');
const Logistic = require('../models/schemas/logisticSchema');

const {
    user_roles,
    user_accountStatus,
    user_availabilityStatus,
    anomaly_reasons,
    anomaly_severities,
    anomaly_status,
    item_types,
    item_status,
    event_status,
    logistic_status,
    logistic_step_status, 
    logistic_vehicle_types, 
    notification_types
} = require('../../shared_constants/constants');

async function seed() {

    try {

        let message;

        const mongo_db_name = 'mongodb://localhost:27017/logichain';
        
        await mongoose.connect(mongo_db_name);

        message = `Connecté à la base de données MongoDB : ${mongo_db_name}`;
        
        console.log(message);

        const seed_data_counter = 20;

        // 1. Nettoyage
        await Promise.all([
            User.deleteMany({}), 
            Notification.deleteMany({}),
            Item.deleteMany({}), 
            Anomaly.deleteMany({}),
            Event.deleteMany({}), 
            Logistic.deleteMany({})
        ]);

        // 2. Génération des Utilisateurs
        const users = [];
        const saltRounds = 10;
        
        for (let i = 0; i < seed_data_counter; i++) {
        
            const plainPassword = faker.internet.password();
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            users.push({
                fullName: faker.person.fullName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: faker.helpers.arrayElement(user_roles),
                accountStatus: faker.helpers.arrayElement(user_accountStatus),
                availabilityStatus: faker.helpers.arrayElement(user_availabilityStatus),
                resetPasswordCode: null,
                resetPasswordExpires: null
            });
        }
        
        const createdUsers = await User.insertMany(users);
        
        console.log(`${seed_data_counter} utilisateurs générés.`);

        // 3. Génération des Items
        const items = [];
        
        for (let i = 0; i < seed_data_counter; i++) {
        
            const randomUser = faker.helpers.arrayElement(createdUsers);
        
            items.push({
                userId: randomUser._id,
                name: faker.commerce.productName(),
                type: faker.helpers.arrayElement(item_types),
                details: { info: faker.lorem.sentence() },
                quantity: faker.number.int({ min: 1, max: 30 }),
                status: faker.helpers.arrayElement(item_status),
                isDeleted: false
            });
        }
        
        const createdItems = await Item.insertMany(items);
        
        console.log(`${seed_data_counter} items générés.`);

        // 4. Génération des Events en France (avec zones GeoJSON globales)
        const events = [];
        
        for (let i = 0; i < seed_data_counter; i++) {
            const randomUser = faker.helpers.arrayElement(createdUsers);
            
            // Coordonnées en France métropolitaine
            const baseLongitude = faker.number.float({ min: -1.0, max: 6.0, precision: 0.0001 });
            const baseLatitude = faker.number.float({ min: 43.5, max: 49.0, precision: 0.0001 });
            const delta = 0.03;

            events.push({
                userId: randomUser._id,
                name: `Événement ${faker.company.catchPhrase()}`,
                description: faker.lorem.sentence(),
                startDate: faker.date.soon(),
                endDate: faker.date.future(),
                location: `${faker.location.city()}`,
                zones: [
                    {
                        zone: { 
                            type: 'Polygon', 
                            coordinates: [[
                                [baseLongitude, baseLatitude], 
                                [baseLongitude + delta, baseLatitude], 
                                [baseLongitude + delta, baseLatitude + delta], 
                                [baseLongitude, baseLatitude + delta], 
                                [baseLongitude, baseLatitude]
                            ]] 
                        },
                        status: 'active'
                    }
                ],
                status: faker.helpers.arrayElement(event_status),
                isDeleted: false
            });
        }
        
        const createdEvents = await Event.insertMany(events);
        
        console.log(`${seed_data_counter} events générés en France.`);

        // 5. Génération des Logistics (reliées optionnellement à un eventId)
        const logistics = [];
        for (let i = 0; i < seed_data_counter; i++) {
            
            const randomUser = faker.helpers.arrayElement(createdUsers);
            const randomEvent = faker.helpers.arrayElement(createdEvents);
            
            const distanceStep1 = faker.number.int({ min: 10, max: 500 });
            const vehicleStep1 = faker.helpers.arrayElement(logistic_vehicle_types);
            
            const distanceStep2 = faker.number.int({ min: 10, max: 500 });
            const vehicleStep2 = faker.helpers.arrayElement(logistic_vehicle_types);

            const departureLongitude = faker.number.float({ min: -1.0, max: 6.0, precision: 0.0001 });
            const departureLatitude = faker.number.float({ min: 43.5, max: 49.0, precision: 0.0001 });
            
            const arrivalLongitude = faker.number.float({ min: -1.0, max: 6.0, precision: 0.0001 });
            const arrivalLatitude = faker.number.float({ min: 43.5, max: 49.0, precision: 0.0001 });
            
            const emissionFactors = { truck: 0.8, ship: 0.1, plane: 2.5, train: 0.5 };
            const fuelStep1 = parseFloat((distanceStep1 * (emissionFactors[vehicleStep1] || 0.5)).toFixed(2));
            const fuelStep2 = parseFloat((distanceStep2 * (emissionFactors[vehicleStep2] || 0.5)).toFixed(2));

            const totalDistance = distanceStep1 + distanceStep2;
            const totalFuelConsumption = parseFloat((fuelStep1 + fuelStep2).toFixed(2));

            logistics.push({
                userId: randomUser._id,
                eventId: randomEvent._id,
                departureDestination: faker.location.streetAddress(),
                departurePosition: {
                    type: 'Point',
                    coordinates: [departureLongitude, departureLatitude]
                },
                arrivalDestination: faker.location.streetAddress(),
                arrivalPosition: {
                    type: 'Point',
                    coordinates: [arrivalLongitude, arrivalLatitude]
                },
                status: faker.helpers.arrayElement(logistic_status),
                totalDistance: totalDistance,
                totalFuelConsumption: totalFuelConsumption,
                statusHistory: [
                    { 
                        status: 'starting', 
                        changedAt: faker.date.past(), 
                        userId: randomUser._id 
                    }
                ],
                steps: [
                    { 
                        location: faker.location.city(), 
                        position: {
                            type: 'Point',
                            coordinates: [departureLongitude + 0.01, departureLatitude + 0.01]
                        },
                        distance: distanceStep1,
                        vehicle: vehicleStep1,
                        fuelConsumption: fuelStep1,
                        status: faker.helpers.arrayElement(logistic_step_status)
                    },
                    { 
                        location: faker.location.city(),
                        position: {
                            type: 'Point',
                            coordinates: [arrivalLongitude - 0.01, arrivalLatitude - 0.01]
                        },
                        distance: distanceStep2,
                        vehicle: vehicleStep2,
                        fuelConsumption: fuelStep2,
                        status: faker.helpers.arrayElement(logistic_step_status)
                    }
                ]
            });
        }

        const createdLogistics = await Logistic.insertMany(logistics);
        
        console.log(`${seed_data_counter} dossiers logistiques générés.`);

        // 6. Génération des Anomalies (liées à eventId et positionnées à l'intérieur des zones)
        const anomalies = [];
    
        for (let i = 0; i < seed_data_counter; i++) {
    
            const randomUser = faker.helpers.arrayElement(createdUsers);
            const randomEvent = faker.helpers.arrayElement(createdEvents);
            const randomLogistic = faker.helpers.arrayElement(createdLogistics);
            
            const randomStep = randomLogistic.steps?.[0];
            const randomItem = createdItems.length > 0 ? faker.helpers.arrayElement(createdItems) : null;
        
            const zoneCoordonates = randomEvent.zones[0].zone.coordinates[0];
            const minLongitude = zoneCoordonates[0][0];
            const maxLongitude = zoneCoordonates[1][0];
            const minLatitude = zoneCoordonates[0][1];
            const maxLatitude = zoneCoordonates[2][1];

            const anomalyLongitude = faker.number.float({ min: minLongitude, max: maxLongitude, precision: 0.0001 });
            const anomalyLatitude = faker.number.float({ min: minLatitude, max: maxLatitude, precision: 0.0001 });

            anomalies.push({
                userId: randomUser._id,
                eventId: randomEvent._id,
                logisticId: randomLogistic._id,
                stepId: randomStep?._id,
                itemId: randomItem?._id,
                description: faker.lorem.words(5),
                reason: faker.helpers.arrayElement(anomaly_reasons),
                severity: faker.helpers.arrayElement(anomaly_severities),
                status: faker.helpers.arrayElement(anomaly_status),
                isDeleted: false,
                location: { 
                    type: 'Point', 
                    coordinates: [anomalyLongitude, anomalyLatitude] 
                }
            });
        }
        
        await Anomaly.insertMany(anomalies);
        console.log(`${seed_data_counter} anomalies générées (dans les zones des événements).`);

        // 7. Génération des Notifications
        const notifications = [];
        for (let i = 0; i < seed_data_counter; i++) {
            const randomUser = faker.helpers.arrayElement(createdUsers);
            notifications.push({
                userId: randomUser._id,
                message: faker.lorem.sentence(),
                type: faker.helpers.arrayElement(notification_types),
                isRead: faker.datatype.boolean()
            });
        }
        
        await Notification.insertMany(notifications);
        console.log(`${seed_data_counter} notifications générées.`);

        console.log(`Toutes les collections ont été générées avec succès !`);
    
    } catch (error) {
        console.error("Erreur lors du seeding :", error);
    } finally {
        process.exit();
    }
}

seed();