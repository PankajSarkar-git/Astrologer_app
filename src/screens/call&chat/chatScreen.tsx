import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Modal from 'react-native-modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { useWebSocket } from '../../hooks/use-socket-new';
import { Message } from '../../utils/types';
import {
  useChatMessages,
  useUploadChatImage,
} from '../../api/hooks/useSession';

import { COLORS } from '../../constant/colors';
import { scale, verticalScale, moderateScale } from '../../utils/sizer';
import SendIcon from '../../assets/icon/sendIcon';
import CameraIcon from '../../assets/icon/camera-icon';
import useKeyboardStatus from '../../hooks/use-keyboard';
import { StompSubscription } from '@stomp/stompjs';
import { decodeMessageBody } from '../../utils/utils';
import {
  addMessage,
  prependMessages,
  setMessages,
  setOtherUser,
  setSession,
} from '../../store/reducer/session';
import CameraModal from '../../components/common/camera-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const isKeyboardOpen = useKeyboardStatus();
  const userId = useAppSelector(s => s.auth.user.id);
  const session = useAppSelector(s => s.session.session);
  const otherUser = useAppSelector(s => s.session.otherUser);
  const otherUserId = otherUser?.id;
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { subscribe, send, unsubscribe } = useWebSocket(userId);
  const [input, setInput] = useState('');
  const typingTimeoutRef = useRef<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  /* ================= CHAT HISTORY (REACT QUERY) ================= */
  const PAGE_SIZE = 15;
  const chatQueryKey = `/chat/${session?.id}?size=${PAGE_SIZE}`;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const chatQuery = `/${session?.id}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatMessages(chatQuery, !!session?.id);

  /* ================= FLATTEN + NORMALIZE ================= */
  // const messages: Message[] = useMemo(() => {
  //   if (!data?.pages) return [];

  //   return data.pages.flatMap(page => page.messages).reverse(); // REQUIRED for inverted FlatList
  // }, [data]);

  const messages = useAppSelector(state => state.session.messages);
  const dispatch = useAppDispatch();
  console.log(messages, 'messages');

  /* ================= SOCKET (NEW MESSAGES) ================= */

  // useEffect(() => {
  //   if (!session?.id) return;

  //   const sub = subscribe(`/topic/chat/${userId}/messages`, msg => {
  //     try {
  //       const newMsg: Message = JSON.parse(msg.body);

  //       queryClient.setQueryData(
  //         ['chat-messages', chatQueryKey],
  //         (old: any) => {
  //           if (!old) return old;

  //           old.pages[0].messages.unshift(newMsg);
  //           return { ...old };
  //         },
  //       );
  //     } catch {}
  //   });

  //   return () => {
  //     unsubscribe(`/topic/chat/${userId}/messages`);
  //   };
  // }, [session?.id]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!data?.pages || initializedRef.current) return;

    const allMessages = data.pages.flatMap(page => page.messages); // important for inverted list

    dispatch(setMessages(allMessages));
    initializedRef.current = true;
  }, [data]);

  useEffect(() => {
    if (!data?.pages?.length) return;

    const lastPage = data.pages[data.pages.length - 1];
    if (!lastPage?.messages?.length) return;

    const olderMessages = [...lastPage.messages];
    dispatch(prependMessages(olderMessages));
  }, [isFetchingNextPage]);

  const messageSubDest = `/topic/chat/${userId}/messages`;
  const typingSubDest = `/topic/chat/${userId}/typing`;

  const chatEndDest = `/topic/chat/${session?.id}`;

  useEffect(() => {
    let chatTimerSub: StompSubscription | undefined;
    let chatEndSub: StompSubscription | undefined;
    let chatMessage: StompSubscription | undefined;
    let typingSub: StompSubscription | undefined;
    if (session && session.status !== 'ENDED') {
      chatMessage = subscribe(messageSubDest, msg => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          dispatch(addMessage(data));
        } catch (err) {
          console.error('Failed to parse chat message:', err);
        }
      });
      typingSub = subscribe(typingSubDest, msg => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          if (data.senderId === otherUserId) {
            setOtherUserTyping(data.typing);
          }
          console.log(JSON.parse(decodeMessageBody(msg)));
        } catch (err) {
          console.error('Failed to parse chat typing:', err);
        }
      });

      chatEndSub = subscribe(chatEndDest, msg => {
        try {
          const data = JSON.parse(decodeMessageBody(msg));
          if (data.status === 'ended') {
            dispatch(
              setSession({
                ...session,
                status: data.status === 'ended' ? 'ENDED' : 'ACTIVE',
              }),
            );
          }
        } catch (err) {
          console.error('Failed to parse chat end message:', err);
        }
      });
    }

    return () => {
      chatEndSub && unsubscribe(chatEndDest);
      chatMessage && unsubscribe(messageSubDest);
      typingSub && unsubscribe(typingSubDest);

    };
  }, [session, subscribe]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {

        dispatch(setSession(null));
        dispatch(setOtherUser(null));
      };
    }, [])
  );

  /* ================= SEND MESSAGE ================= */

  const handleInputChange = (text: string) => {
    setInput(text);
    if (!session) return;

    send(
      `/app/chat.typing`,
      {},
      JSON.stringify({
        senderId: userId,
        receiverId: otherUserId,
        sessionId: session.id,
        typing: true,
      }),
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      send(
        `/app/chat.typing`,
        {},
        JSON.stringify({
          senderId: userId,
          receiverId: otherUserId,
          sessionId: session.id,
          typing: false,
        }),
      );
      typingTimeoutRef.current = null;
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || !session) return;
    const msg: Message = {
      senderId: userId,
      receiverId: otherUser?.id!,
      sessionId: session.id,
      message: input.trim(),
      type: 'TEXT',
      timestamp: new Date(),
    };
    send('/app/chat.send', {}, JSON.stringify(msg));
    // queryClient.setQueryData(['chat-messages', chatQueryKey], (old: any) => {
    //   if (!old) return old;
    //   old.pages[0].messages.unshift(msg);
    //   return { ...old };
    // });
    console.log('mesage sent------------');
    dispatch(addMessage(msg));
    setInput('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    send(
      `/app/chat.typing`,
      {},
      JSON.stringify({
        senderId: userId,
        receiverId: otherUserId,
        typing: false,
      }),
    );
  };

  /* ================= RENDER MESSAGE ================= */

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === userId;

    const handleImagePress = () => {
      setSelectedImage(item.message); // this is the image URL
      setImageModalVisible(true);
    };

    return (
      <TouchableOpacity
        onPress={item.type === 'IMAGE' ? handleImagePress : () => { }}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.message,
            isMine ? styles.myMessage : styles.otherMessage,
          ]}
        >
          {item.type === 'IMAGE' ? (
            <Image
              source={{ uri: item.message }}
              style={{ width: 200, height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : (
            <Text>{item.message}</Text>
          )}
          {/* <Text style={styles.timestamp}>
            {isMine
              ? getTimeOnly(item?.timestamp, true)
              : formatedDate(item?.timestamp)}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const { mutateAsync: uploadChatImage } = useUploadChatImage();

  const handleCaptureImage = async (filePath: string) => {
    if (!filePath) return;
    if (!session || !otherUserId) return;

    try {
      const formData = new FormData();

      formData.append('image', {
        uri: 'file://' + filePath,
        name: `image-${userId}-${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);

      formData.append('sessionId', session.id);

      const payload = await uploadChatImage(formData);

      if (!payload?.imgUrl) {
        throw new Error('Invalid upload response');
      }

      const newMsg: Message = {
        senderId: userId,
        receiverId: otherUserId,
        sessionId: session.id,
        message: payload.imgUrl,
        type: 'IMAGE',
        timestamp: new Date(),
      };

      // realtime send
      send('/app/chat.send', {}, JSON.stringify(newMsg));

      // optimistic UI
      dispatch(addMessage(newMsg));
    } catch (error) { }
  };

  return (
    <View style={styles.root}>
      <CameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCaptureImage}
      />
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.6}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>

          <View>
            <Text style={styles.title} numberOfLines={1}>
              {otherUser?.name || 'Chat'}
            </Text>

            {otherUserTyping && <Text style={styles.typing}>typing...</Text>}
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={'height'}
        keyboardVerticalOffset={isKeyboardOpen ? 32 : 0}
      >
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item, i) => `${item.timestamp}-${i}`}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.1}
        />

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              !!session && session.status === 'ACTIVE'
                ? setShowCamera(true)
                : {}
            }
          >
            <CameraIcon size={16} />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={handleInputChange}
            placeholder="Type a message"
            style={styles.input}
            editable={session?.status === 'ACTIVE'}
          />

          <TouchableOpacity onPress={handleSend} style={styles.iconBtn}>
            <SendIcon />
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={imageModalVisible}
          onBackdropPress={() => setImageModalVisible(false)}
          onBackButtonPress={() => setImageModalVisible(false)}
          style={{ margin: 0 }}
        >
          <ImageViewer
            imageUrls={[{ url: selectedImage || '' }]}
            enableSwipeDown
            onSwipeDown={() => setImageModalVisible(false)}
            backgroundColor="#000"
          />
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.theme.white },
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: '75%',
  },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },

  backIcon: {
    fontSize: 28,
    color: COLORS.theme.black,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },

  avatarText: {
    color: COLORS.theme.white,
    fontSize: 18,
    fontWeight: '600',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.theme.black,
  },

  typing: {
    fontSize: 12,
    color: COLORS.theme.gray.text,
    marginTop: 2,
  },

  container: { flex: 1 },
  list: { padding: scale(12) },
  bubble: {
    maxWidth: '75%',
    padding: scale(10),
    borderRadius: 12,
    marginVertical: verticalScale(4),
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.theme.secondary,
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.theme.gray.light,
  },
  text: { color: COLORS.theme.black },
  image: { width: 200, height: 200, borderRadius: 8 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(8),
    borderTopWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.theme.gray.light,
    borderRadius: 20,
    paddingHorizontal: scale(12),
    marginHorizontal: scale(8),
  },
  iconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: 20,
    backgroundColor: COLORS.theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
