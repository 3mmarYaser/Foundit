import { launchCamera } from 'react-native-image-picker'
import { requestCameraPermission } from './Permissions.android'
import { Alert } from 'react-native'

//

export const capturePhoto = async () => {
  const hasCamera = await requestCameraPermission()

  if (hasCamera) {
    const result = await launchCamera({ mediaType: 'photo' })

    if (result.assets && result.assets[0]?.uri) {
      return result.assets[0].uri
    }
  } else {
    Alert.alert('Camera permission denied')
  }

  return null
}
