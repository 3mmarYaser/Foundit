import React, { useContext } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'
import AppContext from '../providers/AppContext'
import { ItemType } from '../types/Item'

interface FABProps {
  onPress: () => void
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
  const { activeTab } = useContext(AppContext)

  return (
    <Pressable
      style={[
        styles.fab,
        activeTab == ItemType.Found ? styles.found : styles.lost,
      ]}
      onPress={onPress}
    >
      {AppIcons.add(24)}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: Colors.background,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  found: {
    backgroundColor: Colors.secondaryLight,
  },
  lost: {
    backgroundColor: Colors.dangerLight,
  },
})

export default FAB
