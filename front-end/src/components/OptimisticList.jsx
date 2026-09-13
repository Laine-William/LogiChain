import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/components/OptimisticList';

/**
 * Gère visuellement le mécanisme de rollback en cas d'erreur de synchronisation.
 * @param {{ data: Array, renderItemContent: function, onRetry: function }} props
 */
const OptimisticList = ({ data, renderItemContent, onRetry }) => {
  
  const renderItem = ({ item }) => {
    // Les statuts doivent être pilotés par le state global (ex: zustand ou redux)
    const isPending = item._syncStatus === 'pending';
    const isError = item._syncStatus === 'error';

    return (
      <View style={[
        styles.card, 
        isPending && styles.cardPending, 
        isError && styles.cardError
      ]}>
        
        <View style={styles.content}>
          {renderItemContent(item)}
        </View>

        {/* Reflète immédiatement l'état et prépare un "rollback" visuel en cas d'échec */}
        {isPending && <Text style={styles.pendingText}>Action en attente de synchronisation...</Text>}
        
        {isError && (
          <TouchableOpacity onPress={() => onRetry(item.id)} style={styles.retryButton}>
            <Text style={styles.retryText}>Échec réseau. Réessayer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default OptimisticList;