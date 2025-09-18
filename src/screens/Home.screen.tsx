import React, { useCallback, useContext, useState } from 'react'

import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native'

import TopBar from '../components/TopBar'
import ItemCard from '../components/ItemCard'
import BottomNav from '../components/BottomNav'
import AppContext from '../providers/AppContext'

import { Colors } from '../theme/Colors'
import { SCREEN_KEYS } from '../navigation/ScreenKeys'
import { Item } from '../domain/entities/Item'

//

const HomeScreen = ({ navigation }: any) => {
  const { items, activeTab, selectTab, isSyncing, sync, imageNameToUri }: any =
    useContext(AppContext)

  const [refreshing, setRefreshing] = useState(isSyncing)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      await sync()
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleOpenDetails = (id: number) => {
    navigation.navigate(SCREEN_KEYS.ItemDetails, { itemId: id })
  }

  const handleAdd = () => {
    navigation.navigate(SCREEN_KEYS.ReportItem, { type: activeTab })
  }

  const mapItemImageName = (item: Item) => ({
    ...item,
    photo_uri: imageNameToUri(item.photo_uri),
  })

  //

  return (
    <View style={styles.root}>
      <TopBar />

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ItemCard
            item={mapItemImageName(item)}
            onPress={() => handleOpenDetails(item.id)}
          />
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            // Android spinner color
            colors={[Colors.primary, Colors.secondary, Colors.accent]}
            // iOS spinner color
            tintColor={Colors.accent}
          />
        }
        contentContainerStyle={{
          flex: 1,
        }}
        ListEmptyComponent={
          <View style={styles.noItemsView}>
            <Text style={styles.noItemsText}>
              No items{'\n'}Pull to refresh
            </Text>
          </View>
        }
      />

      <BottomNav
        activeTab={activeTab}
        onTabChange={selectTab}
        onAdd={handleAdd}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  list: {
    padding: 4,
  },

  noItemsView: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    margin: 'auto',
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
  },
})

export default HomeScreen
