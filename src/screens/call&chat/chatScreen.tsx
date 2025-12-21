import React, { useEffect, useRef, useState } from 'react';
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

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { useWebSocket } from '../../hooks/use-socket-new';
import { Message } from '../../utils/types';
import { addMessage, clearSession } from '../../store/reducer/session';
import { COLORS } from '../../constant/colors';
import { scale, verticalScale, moderateScale } from '../../utils/sizer';
import SendIcon from '../../assets/icon/sendIcon';
import CameraIcon from '../../assets/icon/camera-icon';

const PAGE_SIZE = 15;

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const userId = useAppSelector(s => s.auth.user.id);
  const session = useAppSelector(s => s.session.session);
  const messages = useAppSelector(s => s.session.messages);
  const otherUser = useAppSelector(s => s.session.otherUser);

  const { subscribe, send, unsubscribe } = useWebSocket(userId);

  const [input, setInput] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const flatListRef = useRef<FlatList<Message>>(null);

  /* ---------------- SOCKET SUBSCRIBE ---------------- */

  useEffect(() => {
    if (!session) return;

    const msgSub = subscribe(`/topic/chat/${userId}/messages`, msg => {
      try {
        const data = JSON.parse(msg.body);
        dispatch(addMessage(data));
      } catch {}
    });

    return () => {
      unsubscribe(`/topic/chat/${userId}/messages`);
    };
  }, [session]);

  /* ---------------- SEND MESSAGE ---------------- */

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
    dispatch(addMessage(msg));
    setInput('');
  };

  /* ---------------- LOAD MORE ---------------- */

  const loadMore = async () => {
    if (loadingMore || !hasMore || !session) return;
    setLoadingMore(true);

    // call your API here if needed
    setPage(p => p + 1);
    setLoadingMore(false);
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      dispatch(clearSession());
    };
  }, []);

  /* ---------------- RENDER MESSAGE ---------------- */

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(item, i) => `${item.timestamp}-${i}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
        />

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <CameraIcon size={16} />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.theme.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderBottomWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  back: {
    fontSize: 28,
    marginRight: scale(10),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  list: {
    padding: scale(12),
  },
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
  text: {
    color: COLORS.theme.black,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
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
