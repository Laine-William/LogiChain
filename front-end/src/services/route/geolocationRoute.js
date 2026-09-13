import { useState, useEffect } from 'react';
import apiClient from '../api/clientApi';

export const useGeolocationRoute = (initialDep = '', initialArr = '', initialDepCoords = null, initialArrCoords = null) => {
    const [departureDestination, setDeparture] = useState(initialDep);
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [departureCoords, setDepartureCoords] = useState(initialDepCoords);

    const [arrivalDestination, setArrival] = useState(initialArr);
    const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
    const [arrivalCoords, setArrivalCoords] = useState(initialArrCoords);

    const [stepLocation, setStepLocation] = useState('');
    const [stepSuggestions, setStepSuggestions] = useState([]);
    const [stepCoords, setStepCoords] = useState(null);

    // Synchronisation automatique si les données initiales changent (ex: ouverture de la modale d'édition)
    useEffect(() => {
        if (initialDep) setDeparture(initialDep);
        if (initialDepCoords) setDepartureCoords(initialDepCoords);
        if (initialArr) setArrival(initialArr);
        if (initialArrCoords) setArrivalCoords(initialArrCoords);
    }, [initialDep, initialArr, initialDepCoords?.lat, initialDepCoords?.lng, initialArrCoords?.lat, initialArrCoords?.lng]);

    const formatGeopfLabel = (item) => {
        const city = item.city || '';
        const postcode = item.postcode || '';
        const name = item.name || item.fulltext || '';
        
        if (city && postcode) return `${city} (${postcode}) - ${name}`;
        return item.fulltext || name;
    };

    const searchOsmLocation = async (query, type) => {
        const trimmedQuery = query.trim();
        if (type === 'departureDestination') {
            setDeparture(query);
            if (!trimmedQuery || trimmedQuery.length < 2) { setDepartureSuggestions([]); return; }
        } else if (type === 'arrivalDestination') {
            setArrival(query);
            if (!trimmedQuery || trimmedQuery.length < 2) { setArrivalSuggestions([]); return; }
        } else {
            setStepLocation(query);
            if (!trimmedQuery || trimmedQuery.length < 2) { setStepSuggestions([]); return; }
        }

        try {
            const response = await apiClient.get(`/geocoding/completion?text=${encodeURIComponent(trimmedQuery)}`);
            const results = response.data.results || [];

            if (type === 'departureDestination') setDepartureSuggestions(results);
            else if (type === 'arrivalDestination') setArrivalSuggestions(results);
            else setStepSuggestions(results);
        } catch (error) {
            console.warn("Erreur de géocodage :", error);
        }
    };

    const handleSelectOsmLocation = (item, type) => {
        const formattedName = formatGeopfLabel(item);
        const coords = { lat: item.y, lng: item.x };
        
        if (type === 'departureDestination') {
            setDeparture(formattedName);
            setDepartureCoords(coords);
            setDepartureSuggestions([]);
        } else if (type === 'arrivalDestination') {
            setArrival(formattedName);
            setArrivalCoords(coords);
            setArrivalSuggestions([]);
        } else {
            setStepLocation(formattedName);
            setStepCoords(coords);
            setStepSuggestions([]);
        }
    };

    return {
        departureDestination, setDeparture, departureSuggestions, setDepartureSuggestions, departureCoords, setDepartureCoords,
        arrivalDestination, setArrival, arrivalSuggestions, setArrivalSuggestions, arrivalCoords, setArrivalCoords,
        stepLocation, setStepLocation, stepSuggestions, setStepSuggestions, stepCoords, setStepCoords,
        searchOsmLocation, handleSelectOsmLocation, formatGeopfLabel
    };
};