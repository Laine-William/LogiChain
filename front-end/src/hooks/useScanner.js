import { useState } from 'react';
import { hardwareScanner } from '../services/scanner/hardwareScanner';

export const useScanner = (onScanSuccess) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (!data || isScanning) return;
    
    setIsScanning(true);
    try {
      hardwareScanner.triggerSuccess();
      if (onScanSuccess) {
        onScanSuccess(data);
      }
    } catch (error) {
      hardwareScanner.triggerError();
    } finally {
      setTimeout(() => setIsScanning(false), 1000);
    }
  };

  return {
    isScanning,
    handleBarCodeScanned,
  };
};