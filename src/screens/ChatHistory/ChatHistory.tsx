import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import PageWithHeader from '../../components/layout/page-with-header';
import ChatHistoryCard from './components/ChatHistoryCard';
import CallHistoryCard from './components/CallHistoryCard';
import Tab from './components/tab';

import { scale, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';
import { textStyle } from '../../constant/text-style';

import { useUserRole } from '../../hooks/use-role';
import { useAppDispatch } from '../../hooks/redux-hook';

import { useChatHistory, useCallHistory } from '../../api/hooks/useSession';

import { setOtherUser, setSession } from '../../store/reducer/session';

import { ChatSession, CallSession, UserDetail } from '../../utils/types';
import AboutIcon from '../../assets/icons/about-icon';

const PAGE_SIZE = 5;

const ChatHistory = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const role = useUserRole();

  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');

  /* ---------------- API QUERIES ---------------- */

  const {
    data: chatRes,
    isLoading: chatLoading,
    refetch: refetchChat,
  } = useChatHistory(`?page=1&limit=${PAGE_SIZE}`, activeTab === 'chat');

  const {
    data: callRes,
    isLoading: callLoading,
    refetch: refetchCall,
  } = useCallHistory(`?page=1&limit=${PAGE_SIZE}`, activeTab === 'call');

  const chatItems: ChatSession[] = chatRes?.chatHistory ?? [];
  const callItems: CallSession[] = callRes?.chatHistory ?? [];

  /* ---------------- REFRESH ON FOCUS ---------------- */

  useEffect(() => {
    if (!isFocused) return;

    activeTab === 'chat' ? refetchChat() : refetchCall();
  }, [isFocused, activeTab]);

  /* ---------------- RENDERERS ---------------- */

  const renderChatItem = ({ item }: { item: ChatSession }) => {
    const otherUser: UserDetail = item.user;

    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setOtherUser(otherUser));
          dispatch(setSession(item));
          navigation.navigate('ChatScreen');
        }}
      >
        <ChatHistoryCard data={item} active={item.status === 'ACTIVE'} />
      </TouchableOpacity>
    );
  };

  const renderCallItem = ({ item }: { item: CallSession }) => {
    return <CallHistoryCard data={item} />;
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWithHeader title="History" scrollEnabled={false}>
      <View style={styles.container}>
        {/* TAB */}
        <Tab
          tabs={[
            { key: 'chat', label: 'Chat' },
            { key: 'call', label: 'Call' },
          ]}
          initialTab="chat"
          onTabChange={key => setActiveTab(key as 'chat' | 'call')}
        />

        {/* CHAT LIST */}
        {activeTab === 'chat' && (
          <FlatList<ChatSession>
            data={chatItems}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              !chatLoading ? (
                <View style={styles.empty}>
                  <AboutIcon color={COLORS.status.info.dark} />
                  <Text style={textStyle.fs_mont_16_500}>No Chat History</Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              chatLoading ? (
                <ActivityIndicator
                  style={{ marginVertical: 20 }}
                  size="small"
                />
              ) : null
            }
          />
        )}

        {/* CALL LIST */}
        {activeTab === 'call' && (
          <FlatList<CallSession>
            data={callItems}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderCallItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              !callLoading ? (
                <View style={styles.empty}>
                  <AboutIcon color={COLORS.status.info.dark} />
                  <Text style={textStyle.fs_mont_16_500}>No Call History</Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              callLoading ? (
                <ActivityIndicator
                  style={{ marginVertical: 20 }}
                  size="small"
                />
              ) : null
            }
          />
        )}
      </View>
    </PageWithHeader>
  );
};

export default ChatHistory;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme.white,
  },
  list: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
  },
  empty: {
    height: verticalScale(400),
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(12),
  },
});
