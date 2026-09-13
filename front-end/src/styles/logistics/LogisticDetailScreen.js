import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa', 
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    
    // --- Header Global (Résumé) ---
    globalSummaryCard: {
        backgroundColor: '#ffffff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    summaryHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    summaryTextColumn: {
        flex: 1,
        paddingRight: 10,
    },
    fluxIdText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    routeTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 6,
    },
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricTextDistance: {
        fontSize: 13,
        color: '#64748b',
        marginLeft: 4,
        marginRight: 12,
    },
    metricTextCo2: {
        fontSize: 13,
        color: '#059669',
        marginLeft: 4,
    },
    historyTopButton: {
        backgroundColor: '#f1f5f9',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    historyTopButtonText: {
        fontSize: 10,
        color: '#475569',
        marginTop: 2,
    },

    // --- Alertes globales et locales ---
    globalAlertBox: {
        backgroundColor: '#fef2f2',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#fca5a5',
    },
    globalAlertTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#b91c1c',
    },
    globalAlertItem: {
        fontSize: 12,
        color: '#7f1d1d',
        marginTop: 2,
    },
    localAlertBox: {
        backgroundColor: '#fff7ed',
        padding: 10,
        marginHorizontal: 12,
        borderRadius: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#fdba74',
    },
    localAlertTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#c2410c',
    },
    localAlertItem: {
        fontSize: 12,
        color: '#9a3412',
        marginTop: 2,
    },

    // --- Conteneur des Étapes ---
    stepsContainer: {
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    stepCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 10,
    },
    stepNumberBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#334155',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepBody: {
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    infoRowSplit: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconStyle: {
        marginRight: 12,
        backgroundColor: '#f8fafc',
        padding: 8,
        borderRadius: 10,
        overflow: 'hidden',
    },
    label: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#334155',
        marginTop: 2,
    },

    // --- Section Équipements ---
    equipmentSection: {
        marginHorizontal: 12,
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    equipmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    equipmentLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 0,
    },
    equipmentList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    equipmentBadge: {
        backgroundColor: '#e2e8f0',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    equipmentBadgeText: {
        fontSize: 11,
        color: '#334155',
    },
    emptyEquipmentText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
    },

    // --- Footer & Actions ---
    stepFooterActionsExtended: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    historyButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },
    anomalyStepButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fca5a5',
        marginHorizontal: 4,
    },
    anomalyStepButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#ef4444',
    },
    iconButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIconButton: {
        backgroundColor: '#f8fafc',
        width: 34,
        height: 34,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    opacityDisabled: {
        opacity: 0.3,
    },
    actionBorderGray: {
        borderColor: '#cbd5e1',
    },
    actionBorderRed: {
        borderColor: '#fca5a5',
    },
    vehicleBadgeInline: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 2,
    },
    vehicleBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        marginHorizontal: 6,
    },
    editButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0056b3',
    },
    
    // --- Utilitaires ---
    flexOne: {
        flex: 1,
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    iconRightMargin: {
        marginRight: 4,
    },

    // --- Modales (Équipement & Anomalie) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 15,
    },
    modalContent: {
        marginVertical: 10,
    },
    modalText: {
        fontSize: 14,
        color: '#334155',
        marginBottom: 6,
    },
    bold: {
        fontWeight: 'bold',
        color: '#0f172a',
    },
    modalStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginLeft: 6,
    },
    itemStatusText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    modalActionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginTop: 15,
    },
    modalCancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        paddingVertical: 10,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0056b3',
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalScanButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    motifOption: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 6,
    },
    motifSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    motifText: {
        fontSize: 13,
        color: '#334155',
    },
    motifTextSelected: {
        fontWeight: 'bold',
        color: '#1d4ed8',
    },
    // --- Styles pour les options de sévérité dans la modale ---
    severityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
        gap: 4,
    },
    severityOption: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    severityText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748b',
    },
    // --------------------------------------------------------
    textInput: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 10,
        height: 70,
        textAlignVertical: 'top',
        marginTop: 6,
        marginBottom: 15,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginTop: 5,
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    cancelBtnText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 13,
    },
    submitBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#ef4444',
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },

    // --- Bouton Flottant (FAB) ---
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 25,
        backgroundColor: '#0056b3',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    }
});