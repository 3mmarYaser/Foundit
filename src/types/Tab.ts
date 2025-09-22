import { ItemType, ItemTypes } from '../domain/entities/Item'

export enum ActiveTab {
  Found = 'Found',
  Lost = 'Lost',
}

export const tabToType = (tab: ActiveTab): ItemType =>
  tab == ActiveTab.Lost ? ItemTypes.Lost : ItemTypes.Found

export const typeToTab = (type: ItemType): ActiveTab =>
  type == ItemTypes.Lost ? ActiveTab.Lost : ActiveTab.Found
