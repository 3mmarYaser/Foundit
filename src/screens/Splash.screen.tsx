// src/ui/screens/SplashScreen.tsx
import { useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { SCREEN_KEYS } from '../navigation/ScreenKeys'
import { Colors } from '../theme/Colors'

//

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(SCREEN_KEYS.Home)
    }, 3000)
  }, [])

  return (
    <View style={styles.root}>
      <Text style={styles.appName}>Foundit</Text>

      <ActivityIndicator
        size={48}
        color="white"
      />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 24,
  },
})
