/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppProvider from './src/providers/AppProvider'
import NavStack from './src/navigation/NavStack'

function App() {
  // const safeAreaInsets = useSafeAreaInsets()
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <AppProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

          <NavStack />
        </SafeAreaView>
      </SafeAreaProvider>
    </AppProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
