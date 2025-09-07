import { PermissionsAndroid, Platform } from 'react-native'

// Request Camera Permission
export async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn('Camera permission error:', err)
      return false
    }
  }
  return true // iOS handled by Info.plist
}

// Request External Storage (Gallery) Permission
export async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        // Use READ_MEDIA_IMAGES for Android 13+, fallback to READ_EXTERNAL_STORAGE
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn('Storage permission error:', err)
      return false
    }
  }
  return true
}

// Request Location Permission
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn('Location permission error:', err)
      return false
    }
  }
  return true
}

// import { PermissionsAndroid, Platform } from 'react-native'

// export async function requestMediaPermissions() {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ])

//       return (
//         granted['android.permission.CAMERA'] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.READ_EXTERNAL_STORAGE'] ===
//           PermissionsAndroid.RESULTS.GRANTED
//       )
//     } catch (err) {
//       console.warn(err)
//       return false
//     }
//   }
//   return true // iOS handled by Info.plist
// }
