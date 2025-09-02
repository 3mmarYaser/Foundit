import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'
import { ActiveTab } from '../types/Tab'

interface ImagePickerProps {
  tab: ActiveTab
  photoUri?: string | null
  onPickCamera: () => void
  onPickGallery: () => void
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  tab,
  photoUri,
  onPickCamera,
  onPickGallery,
}) => {
  const handlePickAction = tab == ActiveTab.Found ? onPickCamera : onPickGallery

  return (
    <Pressable
      style={styles.root}
      onPress={handlePickAction}
    >
      {photoUri ? (
        <Image
          style={styles.image}
          source={{ uri: photoUri }}
          resizeMode="cover"
        />
      ) : tab == ActiveTab.Found ? (
        <View style={[styles._dashed_border, styles.placeholderView]}>
          {AppIcons.camera(40, Colors.gray)}
          <Text style={styles.placeholderText}>Capture photo</Text>
        </View>
      ) : (
        <View style={[styles._dashed_border, styles.placeholderView]}>
          {AppIcons.gallery(40, Colors.gray)}
          <Text style={styles.placeholderText}>Attach image</Text>
        </View>
      )}
    </Pressable>
  )
}

export default ImagePicker

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },

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

  //

  _dashed_border: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
})
