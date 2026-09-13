import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8fafc' 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 12, 
        paddingTop: 40, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderColor: '#e2e8f0' 
    },
    title: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#1e293b' 
    },
    tabsRow: { 
        flexDirection: 'row', 
        backgroundColor: '#e2e8f0', 
        padding: 4 
    },
    tabBtn: { 
        flex: 1, 
        paddingVertical: 6, 
        alignItems: 'center', 
        borderRadius: 6 
    },
    tabBtnActive: { 
        backgroundColor: '#fff' 
    },
    tabText: { 
        fontSize: 11, 
        color: '#64748b', 
        fontWeight: 'bold' 
    },
    tabTextActive: { 
        color: '#0284c7' 
    },
    inputContainer: { 
        padding: 12, 
        backgroundColor: '#fff', 
        minHeight: 260 
    },
    label: { 
        fontSize: 11, 
        fontWeight: 'bold', 
        color: '#64748b', 
        marginBottom: 2, 
        marginTop: 4 
    },
    inputWithClearContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#f1f5f9', 
        borderWidth: 1, 
        borderColor: '#cbd5e1', 
        borderRadius: 6, 
        paddingHorizontal: 6 
    },
    inputInnerField: { 
        flex: 1, 
        height: 32, 
        fontSize: 11, 
        color: '#1e293b' 
    },
    osmDropdownCard: { 
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#cbd5e1', 
        borderRadius: 6, 
        marginTop: 2, 
        maxHeight: 65, 
        zIndex: 10 
    },
    osmSuggestionRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 4, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f1f5f9' 
    },
    calcButton: { 
        backgroundColor: '#0284c7', 
        padding: 8, 
        borderRadius: 6, 
        alignItems: 'center', 
        marginTop: 8 
    },
    calcButtonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 11 
    },
    userListScroll: { 
        maxHeight: 110, 
        borderWidth: 1, 
        borderColor: '#cbd5e1', 
        borderRadius: 6, 
        backgroundColor: '#f8fafc', 
        padding: 4 
    },
    userRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 4, 
        paddingHorizontal: 6, 
        backgroundColor: '#f1f5f9', 
        borderRadius: 4, 
        marginBottom: 2 
    },
    userRowSelected: { backgroundColor: '#e0f2fe', borderColor: '#0284c7', borderWidth: 1 },
    stepBadgeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fed7aa', padding: 6, borderRadius: 6, marginTop: 4 },
    mapContainer: { flex: 0.7 },
    placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    placeholderText: { color: '#64748b', textAlign: 'center', fontSize: 11 },
    footer: { padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0' },
    instructions: { fontSize: 10, color: '#334155', fontStyle: 'italic', marginBottom: 4, textAlign: 'center' },
    saveButton: { 
        backgroundColor: '#16a34a', 
        padding: 10, 
        borderRadius: 6, 
        alignItems: 'center' 
    },
    saveButtonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 12 
    }
});