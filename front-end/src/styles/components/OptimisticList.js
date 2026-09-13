import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  listContainer: { 
    padding: 16 
  },
  
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  cardPending: { 
    opacity: 0.6 
  },
  
  cardError: { 
    borderColor: '#dc3545', 
    backgroundColor: '#fff3f3' 
  },
  
  content: { 
    marginBottom: 8 
  },
  
  pendingText: { 
    color: '#ffc107', 
    fontSize: 12, 
    fontStyle: 'italic', 
    marginTop: 8 
  },
  
  retryButton: { 
    backgroundColor: '#dc3545', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 4, 
    alignSelf: 'flex-start',
    marginTop: 8
  },
  
  retryText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  }
});