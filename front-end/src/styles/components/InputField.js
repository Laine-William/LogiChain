import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  container: { 
    marginBottom: 16 
  },
  
  label: { 
    marginBottom: 8, 
    fontWeight: '600', 
    color: '#333' 
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  
  inputError: { 
    borderColor: '#d9534f' 
  },
  
  errorText: { 
    color: '#d9534f', 
    fontSize: 12, 
    marginTop: 4 
  }
});