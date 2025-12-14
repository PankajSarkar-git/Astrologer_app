import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import PageWithHeader from '../../components/layout/page-with-header';
import FeedPost from './components/feed-post';
import { COLORS } from '../../constant/colors';
import { usePosts } from '../../api/hooks/usePosts';
import { useFocusEffect } from '@react-navigation/native';

const Feed = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts(10);

  // flatten pages
  const posts = data?.pages.flatMap(page => page.posts) || [];
  //console.log(posts, 'posts');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  return (
    <PageWithHeader scroll={false}>
      <View style={{ flex: 1, backgroundColor: COLORS.theme.white }}>
        {isLoading && (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        )}

        <FlatList
          data={posts}
          keyExtractor={item => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => (
            <FeedPost
              id={item.id}
              refetch={refetch}
              astrologerName={item.astrologer?.user?.name ?? ''}
              profileImage={item.astrologer?.user?.imgUri}
              postImages={item.images?.map((img: any) => img.imagUrl) ?? []}
              caption={item.text ?? ''}
            />
          )}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator style={{ marginVertical: 20 }} size="small" />
            ) : null
          }
        />
      </View>
    </PageWithHeader>
  );
};

export default Feed;
