import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 24,
  },
  
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  
  formContainer: {
    width: '100%',
  },

  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },

  forgotPasswordText: {
    color: '#0056b3',
    fontSize: 14,
    fontWeight: '600',
  },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },

  footerText: {
    color: '#666666',
    fontSize: 14,
  },

  linkText: {
    color: '#0056b3',
    fontSize: 14,
    fontWeight: 'bold',
  }
});