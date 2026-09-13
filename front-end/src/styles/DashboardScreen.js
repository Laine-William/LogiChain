import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // --- STYLES GLOBAUX ---
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa', 
        padding: 16 
    },
    
    syncBanner: { 
        backgroundColor: '#e2e3e5', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 15 
    },
    
    syncText: { 
        color: '#383d41', 
        marginBottom: 8, 
        fontWeight: '600',
        fontSize: 14 
    },
    
    section: { 
        marginBottom: 24 
    },
    
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: '#334155', 
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    
    // --- SECTION ACTIONS RAPIDES ---
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    
    actionItem: {
        alignItems: 'center',
        width: '30%',
    },
    
    actionCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    
    actionText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '600',
        textAlign: 'center',
    },

    // --- SECTION ÉVÉNEMENTS & ACCORDÉON ---
    eventCardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },

    eventHeaderTouchable: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    eventSubContent: {
        padding: 12,
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderColor: '#f1f5f9',
    },

    // --- BOUTONS D'ACTION HARMONISÉS (ADMIN) ---
    actionIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconBtnPrimary: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#0284c7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconBtnDanger: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // --- SECTION FLUX LOGISTIQUES (CARTES) ---
    logisticCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    
    statusText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 6,
    },
    
    dateText: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
    },

    // --- SECTION TRAJET (Départ -> Arrivée) ---
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    
    routePoint: {
        alignItems: 'center',
        flex: 1,
    },
    
    routeCity: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 4,
        textAlign: 'center',
    },
    
    routeConnector: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.5,
        justifyContent: 'center',
    },
    
    routeLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#cbd5e1',
        marginHorizontal: 4,
    },

    // --- FOOTER DE LA CARTE ---
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
    },
    
    detailText: {
        fontSize: 12,
        color: '#64748b',
    },

    // --- ÉTAT VIDE (EMPTY STATE) ---
    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },
    
    emptyText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748b',
        fontWeight: '600',
        textAlign: 'center',
    },
    
    emptySubText: {
        marginTop: 6,
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
    },

    // --- STYLES MODALES ADMIN ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    label: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: '#1e293b',
        backgroundColor: '#f8fafc',
    },

    // --- STYLES INPUT AVEC BOUTON CLEAR & OSM ---
    inputWithClearContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 8,
    },
    inputInnerField: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1e293b',
    },
    osmDropdownCard: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#0284c7',
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 8,
        maxHeight: 140,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    osmSuggestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },

    modalActionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginTop: 20,
    },
    modalCancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    modalCancelButtonText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 13,
    },
    modalScanButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0056b3',
        paddingVertical: 12,
        borderRadius: 8,
    },
    modalScanButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});