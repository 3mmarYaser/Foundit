import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../theme/Colors'
import AppContext from '../providers/AppContext'
import { ItemTypes } from '../domain/entities/Item'

interface TopBarProps {
  title?: string
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { activeTab } = useContext(AppContext)

  return (
    <View style={[styles.container]}>
      <Text
        style={[
          styles.title,
          {
            color: title
              ? Colors.primary
              : activeTab == ItemTypes.Found
              ? Colors.secondary
              : Colors.danger,
          },
        ]}
      >
        {title ?? (activeTab == ItemTypes.Found ? 'Found it' : 'Lost it')}
      </Text>
    </View>
  )
}

export default TopBar

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    // paddingHorizontal: 20,
    backgroundColor: Colors.white, // Use your theme
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: Colors.onPrimary, // readable text color
  },
})
