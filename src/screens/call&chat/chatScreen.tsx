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
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { useWebSocket } from '../../hooks/use-socket-new';
import { Message } from '../../utils/types';
import { useChatMessages } from '../../api/hooks/useSession';

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
  setSession,
} from '../../store/reducer/session';

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const isKeyboardOpen = useKeyboardStatus();
  const userId = useAppSelector(s => s.auth.user.id);
  const session = useAppSelector(s => s.session.session);
  const otherUser = useAppSelector(s => s.session.otherUser);
  const otherUserId = otherUser?.id;
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const { subscribe, send, unsubscribe } = useWebSocket(userId);
  const [input, setInput] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ================= CHAT HISTORY (REACT QUERY) ================= */
  const PAGE_SIZE = 15;
  const chatQueryKey = `/chat/${session?.id}?size=${PAGE_SIZE}`;

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

  useEffect(() => {
    if (!data?.pages) return;

    const allMessages = data.pages.flatMap(page => page.messages); // for inverted FlatList

    dispatch(setMessages(allMessages));
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

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.senderId === userId;

    return (
      <View style={[styles.bubble, isMine ? styles.mine : styles.other]}>
        {item.type === 'IMAGE' ? (
          <Image source={{ uri: item.message }} style={styles.image} />
        ) : (
          <Text style={styles.text}>{item.message}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{otherUser?.name || 'Chat'}</Text>
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
          renderItem={renderItem}
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
          <TouchableOpacity style={styles.iconBtn}>
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.theme.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderBottomWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  back: { fontSize: 28, marginRight: scale(10) },
  title: { fontSize: 18, fontWeight: '600' },
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
