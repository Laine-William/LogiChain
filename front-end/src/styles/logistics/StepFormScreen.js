import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  label: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14, color: '#1e293b', backgroundColor: '#f8fafc' },
  row: { flexDirection: 'row' },
  flexOne: { flex: 1 },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 },
  vehicleOption: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 8, backgroundColor: '#f8fafc' },
  vehicleOptionSelected: { backgroundColor: '#0056b3', borderColor: '#0056b3' },
  vehicleText: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#475569' },
  vehicleTextSelected: { color: '#ffffff' },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  statusOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  saveButton: { backgroundColor: '#0056b3', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});