import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { scale, verticalScale } from '../../../utils/sizer';
import { textStyle } from '../../../constant/text-style';
import { COLORS } from '../../../constant/colors';
import { ChatSession } from '../../../utils/types';
import { formatedDate, formatRelativeDate } from '../../../utils/utils';
import { useUserRole } from '../../../hooks/use-role';

interface ChatHistoryCardProps {
  data: ChatSession;
  active: boolean;
}

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ data, active }) => {
  const role = useUserRole();

  const otherUser = role === 'ASTROLOGER' ? data.user : data.astrologer;

  return (
    <View style={[styles.card, active && styles.activeCard]}>
      {/* LEFT */}
      <View style={styles.left}>
        <Image
          source={{
            uri:
              otherUser?.imgUri ||
              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          }}
          style={styles.avatar}
        />

        <View>
          <Text style={[textStyle.fs_abyss_16_400, styles.name]}>
            {otherUser?.name || 'Unknown'}
          </Text>

          <Text style={[textStyle.fs_mont_12_400, styles.subText]}>
            {formatedDate(data.startedAt)}
          </Text>
        </View>
      </View>

      {/* RIGHT */}
      <Text style={[textStyle.fs_mont_12_400, styles.subText]}>
        {formatRelativeDate(data.startedAt)}
      </Text>
    </View>
  );
};

export default ChatHistoryCard;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.theme.white,
    borderRadius: scale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },

  activeCard: {
    borderColor: COLORS.status.info.dark,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },

  avatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: COLORS.theme.gray.light,
  },

  name: {
    color: COLORS.theme.black,
  },

  subText: {
    color: COLORS.theme.gray.text,
    marginTop: verticalScale(2),
  },
});
