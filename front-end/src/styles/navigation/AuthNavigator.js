import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  header: {
    backgroundColor: '#ffffff',
    elevation: 2, // Ombre sur Android
    shadowColor: '#000', // Ombre sur iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  headerTitle: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  
  headerBack: {
    color: '#0056b3',
    fontWeight: '600',
  }
});