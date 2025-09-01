import React from 'react'
import { TextInput, StyleSheet, View } from 'react-native'
import { Colors } from '../theme/Colors'

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  bold?: boolean
}

const InputField = ({
  placeholder,
  value,
  onChangeText,
  multiline,
  bold,
}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          bold && styles.bold,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    // borderWidth: 1,
    // borderColor: Colors.gray,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
})

export default InputField
