import React from 'react'

import { RootStackParamList, SCREEN_KEYS } from './ScreenKeys'

import HomeScreen from '../screens/Home.screen'
import ItemDetailsScreen from '../screens/Details.screen'
import ReportItemScreen from '../screens/Report.screen'

//
// Define screens in a data-driven list
export const Screens: {
  name: keyof RootStackParamList
  component: React.ComponentType<any>
  options?: object
}[] = [
  {
    name: SCREEN_KEYS.Home,
    component: HomeScreen,
    options: { title: 'Foundit' },
  },
  {
    name: SCREEN_KEYS.ItemDetails,
    component: ItemDetailsScreen,
    options: { title: 'Item Details' },
  },
  {
    name: SCREEN_KEYS.ReportItem,
    component: ReportItemScreen,
    options: { title: 'Report Item' },
  },
]
