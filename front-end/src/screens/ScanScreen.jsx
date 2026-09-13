import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useScanner } from '../hooks/useScanner';
import { useOfflineStore } from '../store/offlineStore';
import Button from '../components/Button';
import TopBannerNotification from '../components/TopBannerNotification';
import { styles } from '../styles/ScanScreen';

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { isOnline } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  const { handleBarCodeScanned } = useScanner((data) => {
    console.log('Code scanné avec succès :', data);
    navigation.goBack();
  });

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau rétablit - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <TopBannerNotification isOnline={isOnline} message={networkMessage} />
        <Text style={{ textAlign: 'center', marginBottom: 20, marginTop: 20 }}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
      />
      
      <View style={styles.scannerBox}>
        <Text style={styles.boxText}>Visez le code de l'équipement logistique</Text>
      </View>

      <Button 
        title="Simuler un Scan (ITEM_001)" 
        onPress={() => handleBarCodeScanned({ data: 'ITEM_001' })} 
      />
    </View>
  );
};

export default ScanScreen;