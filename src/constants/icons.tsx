import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../theme/Colors'

export const AppIcons = {
  add: (size = 24, color = Colors.text) => (
    <Feather
      name="plus"
      size={size}
      color={color}
    />
  ),
  lost: (size = 24, color = Colors.text) => (
    <Feather
      name="alert-triangle"
      size={size}
      color={color}
    />
  ),
  found: (size = 24, color = Colors.text) => (
    <Feather
      name="check-circle"
      size={size}
      color={color}
    />
  ),
  location: (size = 24, color = Colors.text) => (
    <MaterialIcons
      name="location-on"
      size={size}
      color={color}
    />
  ),
}
