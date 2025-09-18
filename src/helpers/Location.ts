import Geolocation from '@react-native-community/geolocation'
import { Alert } from 'react-native'
import { requestLocationPermission } from './Permissions.android'
import { LatLong } from '../types/LatLong'

//

export async function detectLocation(): Promise<LatLong | null> {
  const hasPermission = await requestLocationPermission()

  if (!hasPermission) {
    Alert.alert('Location permission denied')
    return null
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        resolve({ lat: latitude, long: longitude })
      },
      error => {
        Alert.alert('Error getting location:\n' + error)
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    )
  })
}
