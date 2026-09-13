import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0056b3',
    elevation: 5, // Ombre pour Android
    shadowColor: '#000', // Ombres pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  logoutButton: {
    marginRight: 15,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff', 
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- STYLES POUR LE HEADER ET LE BADGE ---

  headerRightContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },

  headerTitleContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 11,
    opacity: 0.8,
  },
  
  headerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 15,
  },
  
  statusBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // --- STYLES POUR LA MODALE DE SÉLECTION DU STATUT ---
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'transparent', 
  },

  modalContent: {
    position: 'absolute',
    top: 55, // Positionné précisément sous le header
    right: 15,
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    paddingVertical: 6, 
    width: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  modalHeaderTitle: {
    fontSize: 11, 
    color: '#64748b', 
    fontWeight: 'bold', 
    paddingHorizontal: 12, 
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 4,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  dropdownText: {
    fontSize: 13,
    color: '#1e293b',
  },

  dropdownTextActive: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: 'bold',
  },

  networkIndicatorContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  }
});