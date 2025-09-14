import { StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formWrapper: {
    gap: 16,
    paddingBottom: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 50,
  },
  found: {
    backgroundColor: Colors.secondaryLight,
  },
  lost: {
    backgroundColor: Colors.dangerLight,
  },
  optionText: {
    color: Colors.text,
  },
})
