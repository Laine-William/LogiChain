import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    marginBottom: 10,
    marginTop: 0,
  },
  // 🟢 Styles manquants ajoutés pour l'en-tête dynamique
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#e0f2fe',
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepsScrollContainer: {
    maxHeight: 420,
  },
  stepsScrollContent: {
    paddingRight: 4,
    paddingBottom: 20,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  iconRightMargin: {
    marginRight: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  emptySubText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginLeft: 8,
    marginBottom: 8,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 12,
    width: 24,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  stepBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  stepBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepBlockTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  stepDistance: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepCo2: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
  // 🟢 Style ajouté pour les cartes d'anomalies dans la timeline
  anomalieTimelineCard: {
    backgroundColor: '#fffbeb',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 10,
  },
  anomalieCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  anomalieTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92400e',
  },
  anomalieStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  anomalieCoordsText: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
  }
});