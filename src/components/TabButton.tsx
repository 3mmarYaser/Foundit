import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'

export type TabType = 'lost' | 'found'

interface TabButtonProps {
  label: string
  type: TabType
  isActive?: boolean
  onPress?: () => void
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  type,
  isActive = false,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabBase,
        isActive && type === 'lost' && styles.lost,
        isActive && type === 'found' && styles.found,
      ]}
    >
      {type == 'found' ? AppIcons.found(16) : AppIcons.lost(16)}

      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label}
      </Text>

      {/* {type == 'lost' ? AppIcons.lost(16) : ''} */}
    </Pressable>
  )
}

export default TabButton

const styles = StyleSheet.create({
  tabBase: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 8,
  },

  // Base colors
  found: {
    backgroundColor: Colors.secondaryLight,
  },
  lost: {
    backgroundColor: Colors.dangerLight,
  },

  // // Active state
  // activeTab: {
  //   // borderWidth: 2,
  // },
  // activeLost: {
  //   // borderColor: Colors.danger,
  // },
  // activeFound: {
  //   // borderColor: Colors.secondary,
  // },
  // activeLabel: {
  //   // fontWeight: '700',
  //   // color: Colors.primary,
  // },
})
