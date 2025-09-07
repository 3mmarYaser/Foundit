import { launchImageLibrary } from 'react-native-image-picker'
import { requestStoragePermission } from './Permissions.android'
import { Alert } from 'react-native'

//

export const pickImageFromGallery = async () => {
  const hasStorage = await requestStoragePermission()

  if (hasStorage) {
    const result = await launchImageLibrary({ mediaType: 'photo' })

    if (result.assets && result.assets[0]?.uri) {
      return result.assets[0].uri
    }
  } else {
    Alert.alert('Storage permission denied')
  }

  return null
}
