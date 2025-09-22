import { ItemType } from '../domain/entities/Item'

// Screen keys
export const SCREEN_KEYS = {
  Splash: 'SplashScreen',
  Home: 'HomeScreen',
  ItemDetails: 'ItemDetailsScreen',
  ReportItem: 'ReportItemScreen',
}

// Root Stack Params
export type RootStackParamList = {
  SplashScreen: undefined
  HomeScreen: undefined
  ItemDetailsScreen: { itemId: number }
  ReportItemScreen: { type: ItemType }
}
