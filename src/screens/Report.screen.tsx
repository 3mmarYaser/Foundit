import React, { useContext, useState } from 'react'
import { View, Text, Pressable, ScrollView, Alert } from 'react-native'

import AppContext from '../providers/AppContext'
import TopBar from '../components/TopBar'
import ImagePicker from '../components/ImagePicker'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import { ItemTypes } from '../domain/entities/Item'
import { styles } from './Report.style'
import { LatLong } from '../types/LatLong'
import { AppIcons } from '../constants/icons'
import { Colors } from '../theme/Colors'
import { ActiveTab } from '../types/Tab'
import { capturePhoto } from '../helpers/Camera'
import { pickImageFromGallery } from '../helpers/Gallery'
import { detectLocation } from '../helpers/Location'

//

const ReportItemScreen = ({ route, navigation }: any) => {
  const { addItem }: any = useContext(AppContext)

  const [type, setType] = useState<string>(route.params.type)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [location, setLocation] = useState<LatLong | null>(null)

  //

  const handleCaptureImage = async () => {
    const photo = await capturePhoto()
    setPhotoUri(photo)
  }

  //

  const handlePickFromGallery = async () => {
    const image = await pickImageFromGallery()
    setPhotoUri(image)
  }

  //

  const handleDetectLocation = async () => {
    const location = await detectLocation()
    setLocation(location)
  }

  //

  const handleSubmit = async () => {
    if (!title.trim() || !photoUri) {
      Alert.alert('Validation', 'Title and photo are required!')
      return
    }

    try {
      const newItem = {
        type,
        title,
        description,
        category,
        status: 'open',
        latitude: location?.lat,
        longitude: location?.long,
        photo_uri: photoUri,
      }

      const id = await addItem(newItem)

      navigation.goBack()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to save item.')
    }
  }

  //
  //
  //

  return (
    <>
      <TopBar title="Report an Item" />

      <View style={styles.container}>
        {/* Form */}
        <ScrollView contentContainerStyle={styles.formWrapper}>
          {/* Type Selector */}
          <View style={styles.typesContainer}>
            {Object.values(ItemTypes).map(value => (
              <Pressable
                key={value}
                style={[
                  styles.option,
                  type == value
                    ? value == ItemTypes.Found
                      ? styles.found
                      : styles.lost
                    : null,
                ]}
                onPress={() => setType(value)}
              >
                <Text style={styles.optionText}>{value.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>

          {/* Image Picker */}
          <ImagePicker
            tab={type == 'found' ? ActiveTab.Found : ActiveTab.Lost}
            photoUri={photoUri}
            onPickCamera={handleCaptureImage}
            onPickGallery={handlePickFromGallery}
          />

          {/* Title */}
          <InputField
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            bold
          />

          {/* Description */}
          <InputField
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Category */}
          <InputField
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />

          {/* Location */}
          <Pressable
            onPress={handleDetectLocation}
            style={[
              styles._dashed_border,
              styles.placeholderView,
              location
                ? {
                    borderColor: Colors.primaryLight,
                  }
                : '',
            ]}
          >
            {AppIcons.location(32, location ? Colors.primary : Colors.gray)}

            <Text
              style={[
                styles.placeholderText,
                location
                  ? {
                      color: Colors.primary,
                      fontWeight: 'bold',
                    }
                  : '',
              ]}
            >
              {location
                ? `(${location.lat.toFixed(2)}, ${location.long.toFixed(2)})`
                : 'Click to pick location'}
            </Text>
          </Pressable>
        </ScrollView>

        <PrimaryButton
          title="Submit"
          onPress={handleSubmit}
        />
      </View>
    </>
  )
}

export default ReportItemScreen
