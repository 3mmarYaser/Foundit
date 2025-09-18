import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/ScreenKeys'
import { Colors } from '../theme/Colors'
import { styles } from './Details.style'
import AppContext from '../providers/AppContext'
import { Item, ItemTypes } from '../domain/entities/Item'
import PrimaryButton from '../components/PrimaryButton'

type ItemDetailsRouteProp = RouteProp<RootStackParamList, 'ItemDetailsScreen'>

const ItemDetailsScreen = () => {
  const { getItemById, toggleResolved, imageNameToUri }: any =
    useContext(AppContext)

  const route = useRoute<ItemDetailsRouteProp>()
  const { itemId } = route.params

  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  //

  const handleAction = useCallback(async () => {
    setLoading(true)

    await toggleResolved(itemId)
    const result = await getItemById(itemId)
    setItem(result)

    setLoading(false)
  }, [itemId])

  //

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getItemById(itemId)
        setItem(result)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [itemId])

  //

  if (!item) {
    return <Text style={styles.invalidText}>Invalid item id: {itemId}</Text>
  }

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <Image
          source={{ uri: imageNameToUri(item.photo_uri) }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Title + Badge */}
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.type === ItemTypes.Lost
                      ? Colors.accent
                      : Colors.secondary,
                },
              ]}
            >
              <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
            </View>
          </View>

          {/* Description */}
          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : (
            <Text style={styles.descriptionMuted}>No description provided</Text>
          )}

          {/* Category */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{item.category || 'Uncategorized'}</Text>
          </View>

          {/* Location */}
          {item.latitude && item.longitude ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last seen at:</Text>
              <Text style={styles.value}>
                {item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}
              </Text>
            </View>
          ) : null}

          {/* Dates */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Created:</Text>

            <Text style={styles.value}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Updated:</Text>

            <Text style={styles.value}>
              {new Date(item.updated_at).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      {item.status == 'open' ? (
        <PrimaryButton
          title={item.type === ItemTypes.Lost ? 'I Found It' : 'It’s Mine'}
          loading={loading}
          style={[
            styles.actionBtn,
            {
              backgroundColor:
                item.type === ItemTypes.Lost ? Colors.secondary : Colors.accent,
            },
          ]}
          onPress={handleAction}
        />
      ) : (
        <Text style={styles.resolvedText}>Resolved</Text>
      )}
    </View>
  )
}

export default ItemDetailsScreen
