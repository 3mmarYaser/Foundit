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
  locationPressable: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    // backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },

  //
  placeholderView: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    backgroundColor: Colors.background,
  },
  placeholderText: {
    marginTop: 6,
    color: Colors.gray,
  },

  _dashed_border: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
})
