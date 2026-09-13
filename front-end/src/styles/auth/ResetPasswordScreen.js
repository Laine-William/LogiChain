import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  
  headerContainer: {
    marginBottom: 24,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  
  formContainer: {
    width: '100%',
  },
});