import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/ModalEventZone';
import apiClient from '../../services/api/clientApi';
import { useGeolocationRoute } from '../services/route/geolocationRoute';

const ModalEventZone = ({ visible, onClose, onSave, initialData }) => {
    const [activeTab, setActiveTab] = useState('route'); // 'route' ou 'steps'

    // Nom de l'événement
    const [eventName, setEventName] = useState('');

    const [routeCoords, setRouteCoords] = useState(null);
    const [polygonCoordinates, setPolygonCoordinates] = useState(null);

    // Utilisateurs et Étapes
    const [usersList, setUsersList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [steps, setSteps] = useState([]);
    const [stepVehicle, setStepVehicle] = useState('truck');

    // Extraction préalable pour initialiser le hook
    const initialDepText = initialData?.departureDestination || '';
    const initialArrText = initialData?.arrivalDestination || '';
    
    const initialDepCoords = initialData?.departurePosition?.coordinates ? {
        lat: initialData.departurePosition.coordinates[1],
        lng: initialData.departurePosition.coordinates[0]
    } : null;

    const initialArrCoords = initialData?.arrivalPosition?.coordinates ? {
        lat: initialData.arrivalPosition.coordinates[1],
        lng: initialData.arrivalPosition.coordinates[0]
    } : null;

    const {
        departureDestination, setDeparture, departureSuggestions, setDepartureSuggestions, departureCoords, setDepartureCoords,
        arrivalDestination, setArrival, arrivalSuggestions, setArrivalSuggestions, arrivalCoords, setArrivalCoords,
        stepLocation, setStepLocation, stepSuggestions, setStepSuggestions, stepCoords, setStepCoords,
        searchOsmLocation, handleSelectOsmLocation, formatGeopfLabel
    } = useGeolocationRoute(initialDepText, initialArrText, initialDepCoords, initialArrCoords);

useEffect(() => {
        if (visible) {
            apiClient.get('/users')
                .then(res => setUsersList(res.data || []))
                .catch(() => setUsersList([]));

if (initialData) {
                // 1. Récupération du nom de l'événement (les destinations sont gérées par le hook)
                setEventName(initialData.name || '');
                
                // 2. Extraction sécurisée du départ (GeoJSON MongoDB: [lng, lat] -> Leaflet: {lat, lng})
                let depCoords = null;
                if (initialData.departurePosition?.coordinates) {
                    depCoords = {
                        lat: initialData.departurePosition.coordinates[1],
                        lng: initialData.departurePosition.coordinates[0]
                    };
                }

                // 3. Extraction de l'arrivée (GeoJSON MongoDB: [lng, lat] -> Leaflet: {lat, lng})
                let arrCoords = null;
                if (initialData.arrivalPosition?.coordinates) {
                    arrCoords = {
                        lat: initialData.arrivalPosition.coordinates[1],
                        lng: initialData.arrivalPosition.coordinates[0]
                    };
                }

                setDepartureCoords(depCoords);
                setArrivalCoords(arrCoords);

                // 4. Extraction des étapes
                const formattedSteps = (initialData.steps || []).map(s => {
                    let coordsObj = null;
                    if (s.position?.coordinates) {
                        coordsObj = {
                            lat: s.position.coordinates[1],
                            lng: s.position.coordinates[0]
                        };
                    }
                    return { ...s, coords: coordsObj };
                });
                setSteps(formattedSteps);
                
                // 5. Activation de la carte (routeCoords)
                if (depCoords && arrCoords) {
                    setRouteCoords({ start: depCoords, end: arrCoords });
                } else if (formattedSteps.length > 0) {
                    setRouteCoords({
                        start: depCoords || formattedSteps[0].coords,
                        end: arrCoords || formattedSteps[formattedSteps.length - 1].coords
                    });
                } else {
                    setRouteCoords(null);
                }

                // 6. Extraction du polygone depuis le tableau 'zones'
                if (initialData.zones && initialData.zones.length > 0 && initialData.zones[0].zone?.coordinates) {
                    setPolygonCoordinates(initialData.zones[0].zone.coordinates);
                } else {
                    setPolygonCoordinates(null);
                }

                // 7. Extraction et normalisation blindée des utilisateurs déjà assignés
                if (initialData.userId) {
                    const userIds = Array.isArray(initialData.userId) 
                        ? initialData.userId.map(u => {
                            if (!u) return '';
                            if (typeof u === 'string') return u;
                            if (u._id) return typeof u._id === 'object' ? u._id.toString() : String(u._id);
                            if (u.$oid) return String(u.$oid);
                            return u.toString ? u.toString() : String(u);
                        }).filter(Boolean)
                        : [
                            typeof initialData.userId === 'string' 
                                ? initialData.userId 
                                : (initialData.userId._id ? String(initialData.userId._id) : String(initialData.userId))
                        ].filter(Boolean);
                    setSelectedUsers(userIds);
                } else {
                    setSelectedUsers([]);
                }
                            } else {
                setEventName('');
                setDepartureCoords(null);
                setArrivalCoords(null);
                setRouteCoords(null);
                setPolygonCoordinates(null);
                setSelectedUsers([]);
                setSteps([]);
            }
        }
    }, [visible, initialData]);

    const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return parseFloat((R * c).toFixed(1));
    };

    const handleCalculateRoute = () => {
        if (!departureCoords || !arrivalCoords) {
            alert("Veuillez sélectionner des adresses valides dans les suggestions pour le départ et l'arrivée.");
            return;
        }
        setRouteCoords({ start: departureCoords, end: arrivalCoords });
    };

    const handleAddStep = () => {
        if (!stepLocation.trim() || !stepCoords) {
            alert("Veuillez sélectionner une étape valide dans les suggestions.");
            return;
        }

        const previousPoint = steps.length > 0 ? steps[steps.length - 1].coords : departureCoords;
        const computedDistance = previousPoint 
            ? calculateDistanceKm(previousPoint.lat, previousPoint.lng, stepCoords.lat, stepCoords.lng)
            : 0;

        const newStep = {
            location: stepLocation,
            coords: stepCoords,
            distance: computedDistance,
            vehicle: stepVehicle,
            status: 'to_do',
            items: []
        };

        setSteps([...steps, newStep]);
        setStepLocation('');
        setStepCoords(null);
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSaveAll = async () => {
    
        if (!eventName.trim()) {
            alert("Veuillez saisir le nom de l'événement.");
            return;
        }
    
        if (!polygonCoordinates) {
            alert("Veuillez dessiner ou conserver une zone polygonale sur la carte.");
            return;
        }
    
        if (!departureDestination || !arrivalDestination) {
            alert("Le départ et l'arrivée sont obligatoires.");
            return;
        }

        const zoneData = {
            status: 'active',
            zone: { type: 'Polygon', coordinates: polygonCoordinates }
        };

        try {
            // 1. Enregistrement de l'ÉVÉNEMENT conforme à eventSchemaValidation.js
            const eventPayload = {
                name: eventName,
                description: `Trajet de ${departureDestination} vers ${arrivalDestination}`,
                zones: [zoneData],
                status: 'active'
            };

            const eventResponse = await apiClient.post('/events', eventPayload);
            const createdEventId = eventResponse.data._id || eventResponse.data.id;

            // 2. Enregistrement de la LOGISTIQUE associée (avec les steps, la location et les positions)
            const logisticPayload = {
                eventId: createdEventId,
                userId: selectedUsers,
                departureDestination: departureDestination,
                departurePosition: departureCoords ? { type: 'Point', coordinates: [departureCoords.lng, departureCoords.lat] } : undefined,
                arrivalDestination: arrivalDestination,
                arrivalPosition: arrivalCoords ? { type: 'Point', coordinates: [arrivalCoords.lng, arrivalCoords.lat] } : undefined,
                status: 'starting',
                steps: steps.map(s => ({ 
                    location: s.location, 
                    position: s.coords ? { type: 'Point', coordinates: [s.coords.lng, s.coords.lat] } : undefined,
                    distance: s.distance, 
                    vehicle: s.vehicle, 
                    status: s.status, 
                    items: s.items 
                }))
            };

            await apiClient.post('/logistics', logisticPayload);

            alert("Événement et logistique enregistrés avec succès !");
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement global :", error.response?.data || error.message);
            alert("Erreur lors de l'enregistrement de l'événement ou de la logistique.");
        }
    };

    const generateMapHtml = () => {
        if (!routeCoords) return '';
        const stepsScript = steps.map(s => `
            L.marker([${s.coords?.lat || 0}, ${s.coords?.lng || 0}], {
                icon: L.divIcon({
                    className: 'custom-step-marker',
                    html: '<div style="background-color: #f97316; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>'
                })
            }).addTo(map).bindPopup("<b>Étape:</b> ${s.location}<br><b>Distance:</b> ${s.distance} km");
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
                <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
                <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.2/dist/leaflet-geoman.css" />
                <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.2/dist/leaflet-geoman.min.js"></script>
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
                    #map { height: 100%; width: 100%; }
                    .leaflet-routing-container { display: none !important; }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map');
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

                    var routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(${routeCoords.start.lat}, ${routeCoords.start.lng}),
                            L.latLng(${routeCoords.end.lat}, ${routeCoords.end.lng})
                        ],
                        routeWhileDragging: false, addWaypoints: false, fitSelectedRoutes: true,
                        lineOptions: { styles: [{ color: '#2563eb', weight: 4 }] }
                    }).addTo(map);

                    routingControl.on('routesfound', function(e) {
                        var routes = e.routes;
                        var bounds = L.latLngBounds(routes[0].coordinates);
                        map.fitBounds(bounds, { padding: [50, 50] });
                    });

                    ${stepsScript}

                    map.pm.addControls({
                        position: 'topleft',
                        drawMarker: false, drawCircleMarker: false, drawPolyline: false,
                        drawRectangle: false, drawCircle: false, drawPolygon: true,
                        editMode: true, dragMode: true, cutPolygon: false, removalMode: true,
                    });

                    map.on('pm:create', function(e) {
                        if (e.shape === 'Polygon') {
                            var geoJsonData = e.layer.toGeoJSON();
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'POLYGON_DRAWN',
                                coordinates: geoJsonData.geometry.coordinates
                            }));
                        }
                    });
                </script>
            </body>
            </html>
        `;
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{initialData ? "Modifier l'événement" : "Configuration de l'Événement"}</Text>
                    <TouchableOpacity onPress={onClose}><Ionicons name="close" size={28} color="#475569" /></TouchableOpacity>
                </View>

                {/* Onglets de navigation */}
                <View style={styles.tabsRow}>
                    <TouchableOpacity style={[styles.tabBtn, activeTab === 'route' && styles.tabBtnActive]} onPress={() => setActiveTab('route')}>
                        <Text style={[styles.tabText, activeTab === 'route' && styles.tabTextActive]}>1. Départ & Arrivée</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBtn, activeTab === 'steps' && styles.tabBtnActive]} onPress={() => setActiveTab('steps')}>
                        <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>2. Étapes & Équipe</Text>
                    </TouchableOpacity>
                </View>

                {/* Conteneur formulaire */}
                <View style={styles.inputContainer}>
                    {activeTab === 'route' ? (
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={styles.label}>Nom de l'événement</Text>
                            <View style={styles.inputWithClearContainer}>
                                <TextInput style={styles.inputInnerField} placeholder="Ex: Festival d'été..." value={eventName} onChangeText={setEventName} />
                                {eventName.length > 0 && (
                                    <TouchableOpacity onPress={() => setEventName('')}>
                                        <Ionicons name="close-circle" size={18} color="#94a3b8" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ height: 6 }} />

                            {/* Ville de départ avec position relative pour overlay absolu */}
                            <View style={{ position: 'relative', zIndex: 30 }}>
                                <Text style={styles.label}>Ville de départ</Text>
                                <View style={styles.inputWithClearContainer}>
                                    <TextInput style={styles.inputInnerField} placeholder="Ex: Paris ou 75001..." value={departureDestination} onChangeText={(t) => searchOsmLocation(t, 'departureDestination')} />
                                    {departureDestination.length > 0 && (
                                        <TouchableOpacity onPress={() => { setDeparture(''); setDepartureCoords(null); setDepartureSuggestions([]); }}>
                                            <Ionicons name="close-circle" size={18} color="#94a3b8" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {departureSuggestions.length > 0 && (
                                    <View style={[styles.osmDropdownCard, { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, elevation: 5 }]}>
                                        {departureSuggestions.map((item, idx) => (
                                            <TouchableOpacity key={idx} style={styles.osmSuggestionRow} onPress={() => handleSelectOsmLocation(item, 'departureDestination')}>
                                                <Ionicons name="location-sharp" size={14} color="#0284c7" style={{ marginRight: 6 }} />
                                                <Text style={{ fontSize: 12, color: '#1e293b' }} numberOfLines={1}>{formatGeopfLabel(item)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={{ height: 6 }} />

                            {/* Ville d'arrivée avec position relative pour overlay absolu */}
                            <View style={{ position: 'relative', zIndex: 20 }}>
                                <Text style={styles.label}>Ville d'arrivée</Text>
                                <View style={styles.inputWithClearContainer}>
                                    <TextInput style={styles.inputInnerField} placeholder="Ex: Le Havre ou 76600..." value={arrivalDestination} onChangeText={(t) => searchOsmLocation(t, 'arrivalDestination')} />
                                    {arrivalDestination.length > 0 && (
                                        <TouchableOpacity onPress={() => { setArrival(''); setArrivalCoords(null); setArrivalSuggestions([]); }}>
                                            <Ionicons name="close-circle" size={18} color="#94a3b8" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {arrivalSuggestions.length > 0 && (
                                    <View style={[styles.osmDropdownCard, { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, elevation: 5 }]}>
                                        {arrivalSuggestions.map((item, idx) => (
                                            <TouchableOpacity key={idx} style={styles.osmSuggestionRow} onPress={() => handleSelectOsmLocation(item, 'arrivalDestination')}>
                                                <Ionicons name="flag" size={14} color="#22c55e" style={{ marginRight: 6 }} />
                                                <Text style={{ fontSize: 12, color: '#1e293b' }} numberOfLines={1}>{formatGeopfLabel(item)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity style={styles.calcButton} onPress={handleCalculateRoute}>
                                <Text style={styles.calcButtonText}>Afficher le tracé sur la carte</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ paddingBottom: 10 }}>
                            {/* Étape avec position relative pour overlay absolu */}
                            <View style={{ position: 'relative', zIndex: 30 }}>
                                <Text style={styles.label}>Ajouter une étape (calcul auto des km)</Text>
                                <View style={styles.inputWithClearContainer}>
                                    <TextInput style={styles.inputInnerField} placeholder="Ville ou Code Postal étape..." value={stepLocation} onChangeText={(t) => searchOsmLocation(t, 'step')} />
                                    {stepLocation.length > 0 && (
                                        <TouchableOpacity onPress={() => { setStepLocation(''); setStepCoords(null); setStepSuggestions([]); }}>
                                            <Ionicons name="close-circle" size={18} color="#94a3b8" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {stepSuggestions.length > 0 && (
                                    <View style={[styles.osmDropdownCard, { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, elevation: 5 }]}>
                                        {stepSuggestions.map((item, idx) => (
                                            <TouchableOpacity key={idx} style={styles.osmSuggestionRow} onPress={() => handleSelectOsmLocation(item, 'step')}>
                                                <Ionicons name="pin" size={14} color="#f97316" style={{ marginRight: 6 }} />
                                                <Text style={{ fontSize: 12, color: '#1e293b' }} numberOfLines={1}>{formatGeopfLabel(item)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity style={[styles.calcButton, { backgroundColor: '#f97316', marginTop: 6, padding: 8 }]} onPress={handleAddStep}>
                                <Text style={styles.calcButtonText}>Ajouter l'étape (Marqueur Orange)</Text>
                            </TouchableOpacity>

                            {steps.length > 0 && (
                                <ScrollView style={{ maxHeight: 60, marginVertical: 4 }}>
                                    {steps.map((st, i) => (
                                        <View key={i} style={styles.stepBadgeItem}>
                                            <Text style={{ fontSize: 11, color: '#334155', fontWeight: 'bold' }}>📍 Étape {i+1}: {st.location}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={{ fontSize: 11, color: '#f97316', fontWeight: 'bold' }}>{st.distance} km</Text>
                                                <TouchableOpacity onPress={() => handleRemoveStep(i)}><Ionicons name="trash-outline" size={14} color="#dc2626" /></TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 4 }}>
                                <Text style={[styles.label, { marginTop: 0, marginBottom: 0 }]}>Assigner des transporteurs</Text>
                                <View style={{ backgroundColor: '#e0f2fe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0369a1' }}>
                                        {selectedUsers.length} / {usersList.length} sélectionné(s)
                                    </Text>
                                </View>
                            </View>

                            <ScrollView style={styles.userListScroll} nestedScrollEnabled>
                                {usersList.map((u) => {
                                    const rawId = u._id?.$oid || u._id || u.id;
                                    const uId = rawId ? (typeof rawId === 'object' && rawId.toString ? rawId.toString() : String(rawId)) : '';
                                    const isSelected = selectedUsers.includes(uId);
                                    return (
                                        <TouchableOpacity key={uId} style={[styles.userRow, isSelected && styles.userRowSelected]} onPress={() => toggleUserSelection(uId)}>
                                            <Text style={{ fontSize: 11, color: isSelected ? '#0369a1' : '#334155' }}>👤 {u.fullName || u.email}</Text>
                                            {isSelected && <Ionicons name="checkmark-circle" size={14} color="#0284c7" />}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={styles.mapContainer}>
                    {!routeCoords ? (
                        <View style={styles.placeholder}><Text style={styles.placeholderText}>Validez le départ et l'arrivée pour voir la carte</Text></View>
                    ) : (
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: generateMapHtml() }}
                            style={{ flex: 1 }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onMessage={(event) => {
                                const data = JSON.parse(event.nativeEvent.data);
                                if (data.type === 'POLYGON_DRAWN') setPolygonCoordinates(data.coordinates);
                            }}
                        />
                    )}
                </View>

                {routeCoords && (
                    <View style={styles.footer}>
                        <Text style={styles.instructions}>
                            {polygonCoordinates ? "✅ Zone polygonale définie !" : "🖍️ Dessinez la zone sur la carte (outil polygone)."}
                        </Text>
                        <TouchableOpacity style={[styles.saveButton, !polygonCoordinates && { backgroundColor: '#94a3b8' }]} onPress={handleSaveAll}>
                            <Text style={styles.saveButtonText}>{initialData ? "Mettre à jour l'événement" : "Enregistrer l'événement complet"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default ModalEventZone;