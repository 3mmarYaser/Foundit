import { ItemType } from '../domain/entities/Item'

// Screen keys
export const SCREEN_KEYS = {
  Home: 'HomeScreen',
  ItemDetails: 'ItemDetailsScreen',
  ReportItem: 'ReportItemScreen',
}

// Root Stack Params
export type RootStackParamList = {
  HomeScreen: undefined
  ItemDetailsScreen: { itemId: number }
  ReportItemScreen: { type: ItemType }
}
