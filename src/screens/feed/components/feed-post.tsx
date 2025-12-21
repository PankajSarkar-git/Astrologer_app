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
import { useNavigation } from '@react-navigation/native';

import { scale, verticalScale, scaleFont } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';

import { LikeIcon, LikeIconFilled } from '../../../assets/icons/LikeIcon';
import CommentIcon from '../../../assets/icons/CommentIcon';
import ThreeDotIcon from '../../../assets/icons/ThreeDotIcon';

import { useDeletePost, useLikePost } from '../../../api/hooks/usePosts';
import { useAppSelector } from '../../../hooks/redux-hook';

import CommentsBottomSheet from './comments-bottom-sheet';

const { width } = Dimensions.get('window');

interface FeedPostProps {
  id: string;
  astrologerName: string;
  profileImage: string;
  postImages: string[];
  caption: string;
  astrologerId: string;
  liked: boolean;
  initialLikesCount: number;
  initialCommentCount: number;
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
  liked: initialLiked,
  initialLikesCount,
  initialCommentCount,
}: FeedPostProps) => {
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();
  const userId = useAppSelector(store => store.auth.user.id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // 🔥 COMMENT SHEET STATE
  const [commentVisible, setCommentVisible] = useState(false);

  // 🔥 LIKE STATE
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const { mutate: deletePost, isPending: deleting } = useDeletePost();
  const { mutate: likePost, isPending: liking } = useLikePost();

  /* ---------------- LIKE ---------------- */

  const toggleLike = () => {
    if (liking) return;

    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    likePost(
      {
        postId: id,
        status: prevLiked ? 'unlike' : 'like',
      },
      {
        onError: () => {
          setLiked(prevLiked);
          setLikesCount(prevCount);
        },
      },
    );
  };

  /* ---------------- DELETE ---------------- */

  const confirmDelete = () => {
    deletePost(id, {
      onSuccess: () => {
        setConfirmVisible(false);
        refetch();
      },
    });
  };

  /* ---------------- CAROUSEL ---------------- */

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const safeImages = postImages?.length
    ? postImages
    : ['https://placehold.co/800x600?text=No+Image'];

  const formattedImages = safeImages.map(url => ({ url }));

  /* ---------------- CAPTION ---------------- */

  const MAX_LENGTH = 100;
  const isLong = caption.length > MAX_LENGTH;
  const displayText =
    expanded || !isLong ? caption : caption.slice(0, MAX_LENGTH);

  /* ---------------- RENDER ---------------- */

  return (
    <>
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
            <Pressable onPress={() => setMenuVisible(p => !p)}>
              <ThreeDotIcon size={22} color={COLORS.theme.gray.text} />
            </Pressable>
          )}
        </View>

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

        {/* ACTION BAR */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(10),
            gap: scale(20),
          }}
        >
          <TouchableOpacity onPress={toggleLike} disabled={liking}>
            {liked ? <LikeIconFilled size={26} /> : <LikeIcon size={26} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCommentVisible(true)}>
            <CommentIcon size={26} />
          </TouchableOpacity>
        </View>

        {/* LIKES */}
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              paddingHorizontal: scale(16),
              fontWeight: '600',
            }}
          >
            {likesCount} likes
          </Text>
          <Text
            style={{
              fontWeight: '600',
            }}
          >
            {initialCommentCount} Comments
          </Text>
        </View>

        {/* CAPTION */}
        <View
          style={{
            paddingHorizontal: scale(16),
            paddingBottom: verticalScale(10),
          }}
        >
          <Text style={{ fontSize: scaleFont(13) }}>
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
      </Pressable>

      {/* FULLSCREEN IMAGE VIEWER */}
      <Modal
        isVisible={isViewerVisible}
        style={{ margin: 0 }}
        onBackdropPress={() => setIsViewerVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <ImageViewer
            imageUrls={formattedImages}
            index={activeIndex}
            enableSwipeDown
            onSwipeDown={() => setIsViewerVisible(false)}
          />
        </View>
      </Modal>

      {/* COMMENTS BOTTOM SHEET ✅ */}
      <CommentsBottomSheet
        visible={commentVisible}
        onClose={() => setCommentVisible(false)}
        postId={id}
      />
    </>
  );
};

export default FeedPost;
