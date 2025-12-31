import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { scale, verticalScale } from '../../../utils/sizer';
import { textStyle } from '../../../constant/text-style';
import { COLORS } from '../../../constant/colors';
import CallIcon from '../../../assets/icon/call-icon';
import VideoCallIcon from '../../../assets/icon/video-call-icon';
import { CallSession } from '../../../utils/types';
import { formatedDate, formatRelativeDate } from '../../../utils/utils';

interface CallHistoryCardProps {
  data: CallSession;
}

const CallHistoryCard: React.FC<CallHistoryCardProps> = ({ data }) => {
  const isVideo = data.sessionType === 'VIDEO';

  return (
    <View style={styles.card}>
      {/* LEFT */}
      <View style={styles.left}>
        <Image
          source={{
            uri:
              data?.user?.imgUri ||
              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          }}
          style={styles.avatar}
        />

        <View>
          <Text style={[textStyle.fs_abyss_16_400, styles.name]}>
            {data?.user?.name || 'Unknown'}
          </Text>

          <Text style={[textStyle.fs_mont_12_400, styles.subText]}>
            {formatedDate(data.startedAt)}
          </Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <Text style={[textStyle.fs_mont_12_400, styles.subText]}>
          {formatRelativeDate(data.startedAt)}
        </Text>

        {isVideo ? (
          <VideoCallIcon size={scale(18)} />
        ) : (
          <CallIcon size={scale(18)} />
        )}
      </View>
    </View>
  );
};

export default CallHistoryCard;

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

  right: {
    alignItems: 'flex-end',
    gap: verticalScale(6),
  },
});
