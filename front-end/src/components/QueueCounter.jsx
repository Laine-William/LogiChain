import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/components/QueueCounter';

/**
 * Pastille affichant le nombre d'actions en attente de synchronisation.
 * @param {{ count: number, children: React.ReactNode }} props
 */
const QueueCounter = ({ count, children }) => {
  return (
    <View style={styles.container}>
      {children}
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
};

export default QueueCounter;