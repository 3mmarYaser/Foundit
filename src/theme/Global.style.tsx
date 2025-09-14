import { StyleSheet } from 'react-native'
import { Colors } from './Colors'

export const GlobalStyle = StyleSheet.create({
  _dashed_border: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
})
