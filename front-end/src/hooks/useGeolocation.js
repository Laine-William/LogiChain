import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'lw-geolocation'; // ou @react-native-community/geolocation
import Geolocation from '@react-native-community/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permission de géolocalisation",
            message: "LogiChain a besoin d'accéder à votre position GPS pour géolocaliser les anomalies sur le terrain.",
            buttonNeutral: "Demander plus tard",
            buttonNegative: "Annuler",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentPosition = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setErrorMsg("Permission de localisation refusée.");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setErrorMsg(null);
      },
      (error) => {
        setErrorMsg(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return {
    location,
    errorMsg,
    getCurrentPosition,
  };
};