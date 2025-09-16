import React from 'react'
import { Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { Colors } from '../theme/Colors'

type Props = {
  title: string
  loading?: boolean
  onPress: () => void
}

const PrimaryButton = ({ title, loading, onPress }: Props) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator />
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
