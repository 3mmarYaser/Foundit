import React, { useContext } from 'react'

import { View, FlatList, StyleSheet } from 'react-native'

import TopBar from '../components/TopBar'
import ItemCard from '../components/ItemCard'
import BottomNav from '../components/BottomNav'
import AppContext from '../providers/AppContext'

import { Colors } from '../theme/Colors'
import { SCREEN_KEYS } from '../navigation/ScreenKeys'

//

const HomeScreen = ({ navigation }: any) => {
  const { items, addDummyItem, activeTab, selectTab }: any =
    useContext(AppContext)

  const handleOpenDetails = (id: number) => {
    navigation.navigate(SCREEN_KEYS.ItemDetails, { itemId: id })
  }

  const handleAdd = () => {
    navigation.navigate(SCREEN_KEYS.ReportItem, { type: activeTab })
  }

  return (
    <View style={styles.root}>
      <TopBar />

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
    padding: 12,
  },
})

export default HomeScreen
