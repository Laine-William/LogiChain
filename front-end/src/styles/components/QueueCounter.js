import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  
  countText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});