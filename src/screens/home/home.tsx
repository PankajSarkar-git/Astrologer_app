// import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// import React from 'react';
// import PageWithHeader from '../../components/layout/page-with-header';
// import { useBookings } from '../../api/hooks/useBooking';
// import { BookingCard } from './components/BookingCard';
// import { COLORS } from '../../constant/colors';

// const Home = () => {
//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useBookings(10); // 10 items per page, change if you want

//   // Flatten all pages into a single array
//   const bookings = data?.pages?.flatMap(page => page.appointments || []) || [];

//   const handleLoadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };

//   return (
//     <PageWithHeader scroll={false}>
//       <View
//         style={{ padding: 20, flex: 1, backgroundColor: COLORS.theme.white }}
//       >
//         <Text
//           style={{
//             fontSize: 24,
//             color: COLORS.theme.primary,
//             marginBottom: 20,
//           }}
//         >
//           Your recent bookings
//         </Text>

//         {isLoading && (
//           <ActivityIndicator size="large" style={{ marginTop: 30 }} />
//         )}

//         {isError && !isLoading && (
//           <Text style={{ textAlign: 'center', marginTop: 20 }}>
//             Failed to load bookings
//           </Text>
//         )}

//         {!isLoading && !isError && bookings.length === 0 && (
//           <Text style={{ textAlign: 'center', marginTop: 20 }}>
//             No recent bookings
//           </Text>
//         )}

//         {!isLoading && bookings.length > 0 && (
//           <FlatList
//             className="mb-16"
//             data={bookings}
//             nestedScrollEnabled
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <BookingCard
//                 item={item}
//                 onAccept={booking => {
//                   // call API to accept booking
//                 }}
//                 onReject={booking => {
//                   // call API to reject booking
//                 }}
//               />
//             )}
//             keyExtractor={item => String(item.id)}
//             onEndReached={handleLoadMore}
//             onEndReachedThreshold={0.4}
//             ListFooterComponent={
//               isFetchingNextPage ? (
//                 <ActivityIndicator style={{ marginVertical: 16 }} />
//               ) : null
//             }
//           />
//         )}
//       </View>
//     </PageWithHeader>
//   );
// };

// export default Home;

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback } from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import {
  useBookings,
  useUpdateBookingStatus,
} from '../../api/hooks/useBooking';
import { BookingCard } from './components/BookingCard';
import { COLORS } from '../../constant/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../hooks/redux-hook';
import { setOtherUser, setSession } from '../../store/reducer/session';

const Home = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBookings(10);

  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();

  const bookings = data?.pages?.flatMap(page => page.appointments || []) || [];
  const navigation = useNavigation<any>();
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const dispatch = useAppDispatch();

  return (
    <PageWithHeader scrollEnabled={false}>
      <View
        style={{ padding: 20, flex: 1, backgroundColor: COLORS.theme.white }}
      >
        <Text
          style={{
            fontSize: 24,
            color: COLORS.theme.black,
            marginBottom: 20,
          }}
        >
          Your recent bookings
        </Text>

        {isLoading && (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        )}

        {isError && !isLoading && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Failed to load bookings
          </Text>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No recent bookings
          </Text>
        )}

        {!isLoading && bookings.length > 0 && (
          <FlatList
            refreshing={isLoading}
            onRefresh={refetch}
            className="mb-16"
            data={bookings}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={item => String(item.id)}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator style={{ marginVertical: 16 }} />
              ) : null
            }
            renderItem={({ item }) => (
              <BookingCard
                item={item}
                onStartSession={item => {
                  if (item.sessionType === 'CHAT') {

                    dispatch(setOtherUser(item?.chatSession?.user));
                    dispatch(setSession(item?.chatSession));
                    navigation.navigate('ChatScreen');
                  }
                }}
                onAccept={({ id }) => {
                  updateStatus({
                    id,
                    status: 'APPROVED',
                  });


                }}
                onComplete={({ id }) => {
                  updateStatus({
                    id,
                    status: 'COMPLETED',
                  });
                }}
                onReject={({ id }) => {
                  updateStatus({
                    id,
                    status: 'CANCELLED',
                  });
                }}
              />
            )}
          />
        )}
      </View>
    </PageWithHeader>
  );
};

export default Home;
