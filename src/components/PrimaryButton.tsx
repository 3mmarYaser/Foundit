import React from 'react'
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ViewStyle,
} from 'react-native'
import { Colors } from '../theme/Colors'

type Props = {
  title: string
  loading?: boolean
  onPress: () => void
  style?: ViewStyle | ViewStyle[]
}

const PrimaryButton = ({ title, loading, onPress, style }: Props) => {
  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default PrimaryButton
