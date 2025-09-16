import { StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  invalidText: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    color: Colors.danger,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.placeholder,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: 16,
  },
  descriptionMuted: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  actionBtn: {
    margin: 16,
    // Android shadow
    elevation: 3,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  resolvedText: {
    textAlign: 'center',
    margin: 20,
    color: Colors.gray,
    fontSize: 16,
    fontStyle: 'italic',
  },
})
