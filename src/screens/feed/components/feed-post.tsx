import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';

import { scale, verticalScale, scaleFont } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';
import { LikeIcon, LikeIconFilled } from '../../../assets/icons/LikeIcon';
import { CommentIcon } from '../../../assets/icons/CommentIcon';
import ThreeDotIcon from '../../../assets/icons/ThreeDotIcon';
import { useDeletePost } from '../../../api/hooks/usePosts';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../hooks/redux-hook';

const { width } = Dimensions.get('window');

interface FeedPostProps {
  id: string;
  astrologerName: string;
  profileImage: string;
  postImages: string[];
  caption: string;
  astrologerId: string;
  refetch: () => void;
}

const FeedPost = ({
  id,
  astrologerName,
  profileImage,
  postImages,
  caption,
  refetch,
  astrologerId,
}: FeedPostProps) => {
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { mutate: deletePost, isPending } = useDeletePost();
  const userId = useAppSelector(store => store.auth.user.id);
  const toggleLike = () => setLiked(prev => !prev);

  const onEditPost = (id: string) => {
    setMenuVisible(false);
    navigation.navigate('EditPost', { id: id });
  };

  const onDeletePost = () => {
    setMenuVisible(false);
    setConfirmVisible(true);
  };

  const confirmDelete = () => {
    deletePost(id);
    setConfirmVisible(false);
    refetch();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const safeImages = postImages?.length
    ? postImages
    : ['https://placehold.co/800x600?text=No+Image'];

  const formattedImages = safeImages.map(url => ({ url }));

  const MAX_LENGTH = 100;
  const isLong = caption.length > MAX_LENGTH;
  const displayText =
    expanded || !isLong ? caption : caption.slice(0, MAX_LENGTH);

  return (
    <Pressable
      style={{
        backgroundColor: COLORS.theme.white,
        marginBottom: verticalScale(20),
      }}
      onPress={() => setMenuVisible(false)}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(10),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: profileImage }}
            style={{
              height: scale(40),
              width: scale(40),
              borderRadius: scale(20),
              marginRight: scale(10),
            }}
          />
          <Text style={{ fontWeight: '600', fontSize: scaleFont(14) }}>
            {astrologerName}
          </Text>
        </View>

        {astrologerId === userId && (
          <Pressable
            onPress={e => {
              e.stopPropagation();
              setMenuVisible(prev => !prev);
            }}
          >
            <ThreeDotIcon size={22} color={COLORS.theme.gray.text} />
          </Pressable>
        )}
      </View>

      {/* DROPDOWN MENU */}
      {menuVisible && (
        <Pressable
          onPress={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: verticalScale(55),
            right: scale(16),
            backgroundColor: COLORS.theme.white,
            borderRadius: 8,
            elevation: 10,
            zIndex: 100,
            width: 160,
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => onEditPost(id)}
            style={{ padding: 12 }}
          >
            <Text style={{ fontSize: 14 }}>Edit Post</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDeletePost} style={{ padding: 12 }}>
            <Text style={{ fontSize: 14, color: 'red' }}>Delete Post</Text>
          </TouchableOpacity>
        </Pressable>
      )}

      {/* IMAGE CAROUSEL */}
      <FlatList
        ref={flatListRef}
        data={safeImages}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setActiveIndex(index);
              setIsViewerVisible(true);
            }}
          >
            <Image
              source={{ uri: item }}
              style={{
                width,
                height: verticalScale(350),
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>
        )}
      />

      {/* DOT INDICATOR */}
      {safeImages.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: verticalScale(8),
          }}
        >
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={{
                width: scale(6),
                height: scale(6),
                borderRadius: 10,
                backgroundColor:
                  activeIndex === index
                    ? COLORS.theme.primary
                    : COLORS.theme.gray.light,
                marginHorizontal: scale(4),
              }}
            />
          ))}
        </View>
      )}

      {/* CAPTION */}
      <View
        style={{
          paddingHorizontal: scale(16),
          paddingBottom: verticalScale(10),
        }}
      >
        <View>
          <Text style={{ fontSize: scaleFont(13), marginTop: 4 }}>
            {displayText}
            {!expanded && isLong ? '…' : ''}
          </Text>

          {isLong && (
            <TouchableOpacity onPress={() => setExpanded(p => !p)}>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: scaleFont(13),
                  color: '#2563eb',
                  fontWeight: '600',
                }}
              >
                {expanded ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ACTION BAR */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(10),
          gap: scale(20),
        }}
      >
        <TouchableOpacity onPress={toggleLike}>
          {liked ? <LikeIconFilled size={26} /> : <LikeIcon size={26} />}
        </TouchableOpacity>

        <TouchableOpacity>
          <CommentIcon size={26} />
        </TouchableOpacity>
      </View>

      {/* FULLSCREEN IMAGE VIEWER */}
      <Modal
        isVisible={isViewerVisible}
        style={{ margin: 0 }}
        onBackdropPress={() => setIsViewerVisible(false)}
        onBackButtonPress={() => setIsViewerVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <ImageViewer
            imageUrls={formattedImages}
            index={activeIndex}
            enableSwipeDown
            onSwipeDown={() => setIsViewerVisible(false)}
            saveToLocalByLongPress={false}
            backgroundColor="black"
          />
        </View>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      {confirmVisible && (
        <Pressable
          onPress={() => setConfirmVisible(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            style={{
              width: '85%',
              backgroundColor: COLORS.theme.white,
              borderRadius: 12,
              padding: scale(20),
            }}
          >
            <Text
              style={{
                fontSize: scaleFont(16),
                fontWeight: '600',
                marginBottom: verticalScale(8),
              }}
            >
              Delete post?
            </Text>

            <Text
              style={{
                fontSize: scaleFont(13),
                color: COLORS.theme.gray.text,
                marginBottom: verticalScale(20),
              }}
            >
              This action cannot be undone.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: scale(16),
              }}
            >
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Text style={{ fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity disabled={isPending} onPress={confirmDelete}>
                <Text
                  style={{
                    fontSize: 14,
                    color: isPending ? '#aaa' : 'red',
                    fontWeight: '600',
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}
    </Pressable>
  );
};

export default FeedPost;
