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
  camera: (size?: number, color?: string) => (
    <Feather
      name="camera"
      size={size ?? 32}
      color={color ?? Colors.gray}
    />
  ),
  gallery: (size?: number, color?: string) => (
    <Feather
      name="image"
      size={size ?? 28}
      color={color ?? Colors.gray}
    />
  ),
}
