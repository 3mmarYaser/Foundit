import React, { useState } from 'react'
import { View, Text, Image, Pressable, Modal, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'

interface ImagePickerProps {
  photoUri?: string | null
  onPickCamera: () => void
  onPickGallery: () => void
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  photoUri,
  onPickCamera,
  onPickGallery,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleOpenOptions = () => setModalVisible(true)
  const handleCloseOptions = () => setModalVisible(false)

  return (
    <>
      <Pressable
        style={styles.root}
        onPress={handleOpenOptions}
      >
        {photoUri ? (
          <Image
            style={styles.image}
            source={{ uri: photoUri }}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles._dashed_border, styles.placeholderView]}>
            {AppIcons.camera(40, Colors.gray)}

            <Text style={styles.placeholderText}>Click to add photo</Text>
          </View>
        )}
      </Pressable>

      {/* Bottom Action Sheet */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseOptions}
      >
        <Pressable
          style={styles.bottomSheetContainer}
          onPress={handleCloseOptions}
        >
          <View style={styles.sheetActionsContainer}>
            <Pressable
              style={[styles._dashed_border, styles.sheetAction]}
              onPress={() => {
                handleCloseOptions()
                onPickCamera()
              }}
            >
              {AppIcons.camera(32, Colors.lightGray)}

              <Text style={styles.sheetActionText}>From Camera</Text>
            </Pressable>

            <Pressable
              style={[styles._dashed_border, styles.sheetAction]}
              onPress={() => {
                handleCloseOptions()
                onPickGallery()
              }}
            >
              {AppIcons.gallery(32, Colors.lightGray)}

              <Text style={styles.sheetActionText}>From Gallery</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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

  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sheetActionsContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  sheetAction: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  sheetActionText: {
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
