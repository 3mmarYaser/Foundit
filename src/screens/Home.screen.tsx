import React, { useContext } from 'react'

import { View, FlatList, StyleSheet, Text } from 'react-native'

import TopBar from '../components/TopBar'
import ItemCard from '../components/ItemCard'
import BottomNav from '../components/BottomNav'
import AppContext from '../providers/AppContext'

import { Colors } from '../theme/Colors'
import { SCREEN_KEYS } from '../navigation/ScreenKeys'

//

const HomeScreen = ({ navigation }: any) => {
  const { items, activeTab, selectTab }: any = useContext(AppContext)

  const handleOpenDetails = (id: number) => {
    navigation.navigate(SCREEN_KEYS.ItemDetails, { itemId: id })
  }

  const handleAdd = () => {
    navigation.navigate(SCREEN_KEYS.ReportItem, { type: activeTab })
  }

  return (
    <View style={styles.root}>
      <TopBar />

      {items.length ? (
        <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => handleOpenDetails(item.id)}
            />
          )}
          style={styles.list}
        />
      ) : (
        <View style={styles.noItemsView}>
          <Text style={styles.noItemsText}>No items yet</Text>
        </View>
      )}

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
  },
})

export default HomeScreen
