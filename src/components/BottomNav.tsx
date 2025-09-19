import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import FAB from './FAB'
import TabButton from './TabButton'
import { ActiveTab } from '../types/Tab'

interface BottomNavProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  onAdd: () => void
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onAdd,
}) => {
  return (
    <View style={styles.root}>
      {/* Found Tab */}
      <TabButton
        tab={ActiveTab.Found}
        isActive={activeTab === ActiveTab.Found}
        onPress={() => onTabChange(ActiveTab.Found)}
      />

      {/* Lost Tab */}
      <TabButton
        tab={ActiveTab.Lost}
        isActive={activeTab === ActiveTab.Lost}
        onPress={() => onTabChange(ActiveTab.Lost)}
      />

      {/* FAB */}
      <FAB onPress={onAdd} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 50,
    overflow: 'hidden',
    margin: 8,
  },
})

export default BottomNav
