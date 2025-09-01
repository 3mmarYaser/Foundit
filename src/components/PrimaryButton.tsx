import React from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'
import { Colors } from '../theme/Colors'

type Props = {
  title: string
  onPress: () => void
}

const PrimaryButton = ({ title, onPress }: Props) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
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
