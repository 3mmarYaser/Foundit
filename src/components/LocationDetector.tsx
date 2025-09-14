import React, { useState } from 'react'
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'
import { LatLong } from '../types/LatLong'
import { detectLocation } from '../helpers/Location'
import { GlobalStyle } from '../theme/Global.style'

interface LocationDetectorProps {
  onDetect: (location: LatLong | null) => void
}

const LocationDetector: React.FC<LocationDetectorProps> = ({ onDetect }) => {
  const [isDetecting, setDetecting] = useState(false)
  const [location, setLocation] = useState<LatLong | null>(null)

  const handleDetectLocation = async () => {
    setDetecting(true)

    try {
      setLocation(await detectLocation())

      onDetect(location)
    } catch (e) {
      console.error(e)
      onDetect(null)
    } finally {
      setDetecting(false)
    }
  }

  //
  //

  return (
    <Pressable
      onPress={handleDetectLocation}
      style={[
        GlobalStyle._dashed_border,
        styles.placeholderView,
        location
          ? {
              borderColor: Colors.primaryLight,
            }
          : undefined,
      ]}
    >
      {isDetecting ? (
        <ActivityIndicator />
      ) : (
        AppIcons.location(32, location ? Colors.primary : Colors.gray)
      )}

      <Text
        style={[
          styles.placeholderText,
          location
            ? {
                color: Colors.primary,
                fontWeight: 'bold',
              }
            : undefined,
        ]}
      >
        {location
          ? `(${location.lat.toFixed(2)}, ${location.long.toFixed(2)})`
          : 'Click to pick location'}
      </Text>
    </Pressable>
  )
}

export default LocationDetector

export const styles = StyleSheet.create({
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
})
