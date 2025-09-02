import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView, Alert } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Geolocation from '@react-native-community/geolocation'

import TopBar from '../components/TopBar'
import ImagePicker from '../components/ImagePicker'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import { ItemType, ItemToInsert } from '../types/Item'
import { styles } from './Report.style'
import { LatLong } from '../types/LatLong'
import {
  requestCameraPermission,
  requestLocationPermission,
  requestStoragePermission,
} from '../helpers/Permissions.android'
import { AppIcons } from '../constants/icons'
import { Colors } from '../theme/Colors'
import { ActiveTab } from '../types/Tab'

//

const ReportItemScreen = ({ route, navigation }: any) => {
  const [type, setType] = useState<ItemType>(route.params.type)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [location, setLocation] = useState<LatLong | null>(null)

  //

  const handleCaptureImage = async () => {
    const hasCamera = await requestCameraPermission()

    if (hasCamera) {
      const result = await launchCamera({ mediaType: 'photo' })

      if (result.assets && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri)
      }
    } else {
      Alert.alert('Camera permission denied')
    }
  }

  //

  const handlePickFromGallery = async () => {
    const hasStorage = await requestStoragePermission()

    if (hasStorage) {
      const result = await launchImageLibrary({ mediaType: 'photo' })

      if (result.assets && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri)
      }
    } else {
      Alert.alert('Storage permission denied')
    }
  }

  //

  // Location Picker (later replace with map UI)
  const handlePickLocation = async () => {
    const hasLocation = await requestLocationPermission()

    if (hasLocation) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, long: longitude })
        },
        error => {
          Alert.alert('Error getting location: ' + error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      )
    } else {
      setLocation({ lat: 30.0444, long: 31.2357 }) // Cairo coords
      Alert.alert('Location permission denied')
    }
  }

  //

  const handleSubmit = () => {
    const newItem: ItemToInsert = {
      type,
      title,
      description: description,
      category: category,
      photo_uri: photoUri ?? '',
      latitude: location?.lat,
      longitude: location?.long,
    }

    console.log('Report submitted:', newItem)
    // TODO: Save to DB + capture photo + location

    navigation.goBack()
  }

  return (
    <>
      <TopBar title="Report an Item" />

      <View style={styles.container}>
        {/* Form */}
        <ScrollView contentContainerStyle={styles.formWrapper}>
          {/* Type Selector */}
          <View style={styles.typesContainer}>
            {Object.values(ItemType).map(value => (
              <Pressable
                key={value}
                style={[
                  styles.option,
                  type == value
                    ? value == ItemType.Found
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
            tab={type == ItemType.Found ? ActiveTab.Found : ActiveTab.Lost}
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
            onPress={handlePickLocation}
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
