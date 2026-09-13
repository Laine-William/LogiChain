import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa', 
        padding: 16 
    },
  
    header: {
        marginBottom: 20,
        marginTop: 10,
    },

    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#1e293b', 
        marginBottom: 4 
    },

    subtitle: { 
        fontSize: 14, 
        color: '#64748b', 
        fontWeight: '600'
    },

    stepsContainer: {
        marginBottom: 30,
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
        marginBottom: 12,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
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

stepFooterActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,           // 👈 Ajoute un espacement propre entre les éléments
        marginTop: 8,
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

    co2Text: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#059669',
        marginTop: 2,
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