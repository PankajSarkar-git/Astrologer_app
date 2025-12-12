import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { scale, verticalScale, scaleFont } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';
import { LikeIcon, LikeIconFilled } from '../../../assets/icons/LikeIcon';
import { CommentIcon } from '../../../assets/icons/CommentIcon';

const { width } = Dimensions.get('window');

interface FeedPostProps {
  astrologerName: string;
  profileImage: string;
  postImages: string[];
  caption: string;
}

const FeedPost = ({
  astrologerName,
  profileImage,
  postImages,
  caption,
}: FeedPostProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };
  const comment = () => {};
  const openComments = () => {};
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // fallback for no images
  const safeImages = postImages?.length
    ? postImages
    : ['https://placehold.co/800x600?text=No+Image'];

  const formattedImages = safeImages.map(url => ({ url }));

  return (
    <View
      style={{
        backgroundColor: COLORS.theme.white,
        marginBottom: verticalScale(20),
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(10),
        }}
      >
        <Image
          source={{ uri: profileImage }}
          style={{
            height: scale(40),
            width: scale(40),
            borderRadius: scale(20),
            marginRight: scale(10),
          }}
        />

        <View>
          <Text style={{ fontWeight: '600', fontSize: scaleFont(14) }}>
            {astrologerName}
          </Text>
          <Text
            style={{
              fontSize: scaleFont(11),
              color: COLORS.theme.gray.text,
            }}
          >
            Vedic Astrologer • ★ 4.9
          </Text>
        </View>
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
        renderItem={({ item, index }) => {
          console.log({ uri: item });

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setActiveIndex(index);
                setIsViewerVisible(true);
              }}
            >
              <Image
                source={{
                  uri: item,
                }}
                style={{
                  width: width,
                  height: verticalScale(350),
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          );
        }}
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
        <Text
          style={{
            fontSize: scaleFont(13),
            marginTop: 4,
          }}
        >
          {caption || ''}
        </Text>
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

        <TouchableOpacity onPress={openComments}>
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
            enablePreload
            enableImageZoom
            saveToLocalByLongPress={false}
            backgroundColor="black"
            style={{ width: '100%', height: '100%' }}
            renderHeader={() => (
              <View
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {astrologerName}
                </Text>
              </View>
            )}
            renderFooter={() => (
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingBottom: 40,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  {caption}
                </Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default FeedPost;
