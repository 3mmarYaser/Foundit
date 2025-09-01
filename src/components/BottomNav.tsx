import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import FAB from './FAB'
import TabButton from './TabButton'

interface BottomNavProps {
  activeTab: 'lost' | 'found'
  onTabChange: (tab: 'lost' | 'found') => void
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
        label="Found"
        type="found"
        isActive={activeTab === 'found'}
        onPress={() => onTabChange('found')}
      />

      {/* Lost Tab */}
      <TabButton
        label="Lost"
        type="lost"
        isActive={activeTab === 'lost'}
        onPress={() => onTabChange('lost')}
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
