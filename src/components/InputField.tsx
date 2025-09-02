import React from 'react'
import { TextInput, StyleSheet, View, ViewStyle } from 'react-native'
import { Colors } from '../theme/Colors'

type Props = {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  bold?: boolean
  containerStyle?: ViewStyle | ViewStyle[]
  inputStyle?: ViewStyle | ViewStyle[]
}

const InputField = ({
  placeholder,
  value,
  onChangeText,
  multiline,
  bold,
  containerStyle,
  inputStyle,
}: Props) => {
  return (
    <View style={containerStyle}>
      <TextInput
        style={[
          styles.input,
          inputStyle,
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
  input: {
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
