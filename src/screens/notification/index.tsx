import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewToken,
} from 'react-native';
import PageWithHeader from '../../components/layout/page-with-header';
import { verticalScale } from '../../utils/sizer';
import { formatNotificationTime } from '../../utils/utils';
import {
  useNotifications,
  useMarkNotificationRead,
} from '../../api/hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

/* ---------------- UTILS ---------------- */

const getTypeColor = (type: string) => {
  switch (type) {
    case 'POST_CREATED':
      return '#2563EB';
    case 'BOOKING_APPROVED':
      return '#9C27B0';
    case 'SESSION_CREATED':
      return '#059669';
    default:
      return '#607D8B';
  }
};

/* ---------------- COMPONENT ---------------- */
const Notification = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  // prevents duplicate pagination
  const loadingMoreRef = useRef(false);

  // prevents marking same item twice
  const markedReadRef = useRef<Set<string>>(new Set());

  const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
    useNotifications(true);

  const { mutate: markRead } = useMarkNotificationRead();

  /* ---------------- FLATTEN DATA ---------------- */

  const notifications = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.content ?? page.notifications ?? []);
  }, [data]);

  /* ---------------- REFRESH ---------------- */

  const onRefresh = async () => {
    setRefreshing(true);
    markedReadRef.current.clear();
    await refetch();
    setRefreshing(false);
  };

  /* ---------------- PAGINATION ---------------- */

  const loadMore = () => {
    if (loadingMoreRef.current || !hasNextPage) return;

    loadingMoreRef.current = true;

    fetchNextPage().finally(() => {
      loadingMoreRef.current = false;
    });
  };

  /* ---------------- MARK AS READ ---------------- */

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const unreadIds = viewableItems
        .map(v => v.item)
        .filter(
          item =>
            item && item.read === false && !markedReadRef.current.has(item.id),
        )
        .map(item => item.id);

      if (!unreadIds.length) return;

      unreadIds.forEach(id => {
        markedReadRef.current.add(id);
        markRead(id);
      });
    },
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  const handleNotificationPress = (item: any) => {
    switch (item.type) {
      case 'CHAT_MESSAGE': {
        const chatId = item.metadata?.chatId;
        if (!chatId) return;

        navigation.navigate('History');
        break;
      }

      case 'BOOKING_REQUEST': {
        navigation.navigate('MainTabs', {
          screen: 'Home',
        });
        break;
      }

      case 'POST_CREATED': {
        const postId = item.metadata?.postId;
        if (!postId) return;

        navigation.navigate('MainTabs', {
          screen: 'Feed',
        });
        break;
      }

      default:
        // unknown type, do nothing
        break;
    }
  };

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = useCallback(({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        {/* CENTER */}
        <View style={styles.centerContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.message}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: verticalScale(8) }}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(item.type) },
              ]}
            >
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.rightContainer}>
          <Text style={styles.time}>
            {formatNotificationTime(item.createdAt) ?? 'Just now'}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  }, []);

  /* ---------------- RENDER ---------------- */

  return (
    <PageWithHeader
      title="Notifications"
      themeMode="light"
      scrollEnabled={false}
    >
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => `${item.id}${index}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.7}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </PageWithHeader>
  );
};

export default Notification;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  unreadNotification: {
    backgroundColor: '#F4FAFF',
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },

  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  centerContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  body: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  time: {
    fontSize: 11,
    color: '#888',
  },

  unreadDot: {
    marginTop: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#25D366',
  },

  divider: {
    height: 0.5,
    backgroundColor: '#e5e5e5',
    marginLeft: 70,
  },
});
