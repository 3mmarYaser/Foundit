import React from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Item, ItemTypes } from '../domain/entities/Item'
import { Colors } from '../theme/Colors'
import { AppIcons } from '../constants/icons'

interface Props {
  item: Item
  onPress?: () => void
}

const ItemCard: React.FC<Props> = ({ item, onPress }) => {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      {/* Thumbnail */}
      {item.photo_uri ? (
        <Image
          source={{ uri: item.photo_uri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.image}>
          {item.type == ItemTypes.Found
            ? AppIcons.found(48, Colors.secondaryLight)
            : AppIcons.lost(48, Colors.dangerLight)}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title + Status */}
        <View style={styles.header}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={styles.description}
          numberOfLines={1}
        >
          {item.description ?? ''}
        </Text>

        {/* Footer (Category + Time) */}
        <View style={styles.footer}>
          <Text style={styles.category}>
            {item.category ? item.category : 'Uncategorized'}
          </Text>

          <Text style={styles.date}>
            {new Date(item.created_at).toDateString()}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default ItemCard

// ----------------- STYLES -----------------
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
    // Android shadow
    elevation: 1,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: Colors.placeholder,
  },
  image: {
    width: 72,
    marginVertical: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary,
  },
  statusText: {
    color: Colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
})

//
//
//
//
//
//

// import React from 'react'
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { Colors } from '../theme/Colors'
// import { Item, ItemStatus, ItemType } from '../types/Item'
// import { AppIcons } from '../constants/icons'

// type Props = {
//   item: Item
// }

// const ItemCard = ({ item }: Props) => {
//   return (
//     <View style={styles.card}>
//       {/* {item.photo_uri && (
//         <Image
//           source={{ uri: item.photo_uri }}
//           style={styles.image}
//           />
//           )} */}

//       <View style={styles.image}>
//         {item.type == ItemType.Found
//           ? AppIcons.found(48, Colors.secondaryLight)
//           : AppIcons.lost(48, Colors.dangerLight)}
//       </View>

//       {/* Text info */}
//       <View style={styles.info}>
//         <Text style={styles.title}>{item.title}</Text>

//         {item.description ? (
//           <Text
//             style={styles.desc}
//             numberOfLines={2}
//           >
//             {item.description}
//           </Text>
//         ) : null}

//         <Text
//           style={[
//             styles.meta,
//             {
//               color:
//                 item.status === ItemStatus.Open
//                   ? Colors.primary
//                   : Colors.success,
//             },
//           ]}
//         >
//           {item.status.toUpperCase()}
//         </Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.created_at).toLocaleDateString()}
//         </Text>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     gap: 12,
//     backgroundColor: Colors.white,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     elevation: 2,
//   },
//   image: {
//     width: 64,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: Colors.background,
//   },
//   info: { flex: 1 },
//   title: { fontWeight: '600', fontSize: 16 },
//   desc: { fontSize: 14, color: Colors.gray, marginVertical: 4 },
//   meta: { fontSize: 12, fontWeight: '600' },
//   timestamp: { fontSize: 12, color: Colors.gray, marginTop: 4 },
// })

// export default ItemCard
