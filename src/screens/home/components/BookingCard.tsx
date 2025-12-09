import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { scale, scaleFont, verticalScale } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';
import { textStyle } from '../../../constant/text-style';

type BookingCardProps = {
  item: any;
  onAccept?: (item: any) => void;
  onReject?: (item: any) => void;
};

export const BookingCard = ({ item, onAccept, onReject }: BookingCardProps) => {
  const getStatusColor = (status: any) => {
    if (status === 'Pending') return '#FFA726';
    if (status === 'Confirmed') return '#42A5F5';
    if (status === 'Completed') return '#4CAF50';
    if (status === 'Cancelled') return '#F44336';
    return COLORS.theme.gray.light;
  };

  const getSessionTypeIcon = (type: any) => {
    if (type === 'CHAT') return '💬';
    if (type === 'VIDEO') return '📹';
    return '📞';
  };

  const handleAccept = () => {
    if (onAccept) onAccept(item);
  };

  const handleReject = () => {
    if (onReject) onReject(item);
  };

  const isPending = true;

  return (
    <View
      style={{
        backgroundColor: COLORS.theme.white,
        borderRadius: scale(14),
        padding: scale(16),
        marginBottom: verticalScale(14),
        borderWidth: 1,
        borderColor: COLORS.theme.gray.light,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{
            uri:
              item.astrologer?.imgUri ||
              'https://i.postimg.cc/52hKjTgP/user.png',
          }}
          style={{
            width: scale(46),
            height: scale(46),
            borderRadius: 100,
            marginRight: scale(12),
          }}
        />

        <View style={{ flex: 1 }}>
          <Text style={textStyle.fs_mont_16_600}>{item.astrologer?.name}</Text>
          <Text style={{ fontSize: scaleFont(12), marginTop: 2 }}>
            {getSessionTypeIcon(item.sessionType)} {item.sessionType}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: getStatusColor(item.status),
            paddingHorizontal: scale(10),
            paddingVertical: verticalScale(4),
            borderRadius: scale(12),
          }}
        >
          <Text style={{ color: '#fff', fontSize: scaleFont(12) }}>
            {item.status ? item.status : 'N/A'}
          </Text>
        </View>
      </View>

      <Text style={{ marginTop: 10, fontSize: scaleFont(12) }}>
        📅 {item.appointmentDate} ⏱️ {item.appointmentDuration} mins
      </Text>

      {item.reason ? (
        <Text style={{ marginTop: 6, fontSize: scaleFont(12) }}>
          Reason: {item.reason}
        </Text>
      ) : null}

      {isPending && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: verticalScale(12),
          }}
        >
          <TouchableOpacity
            onPress={handleReject}
            style={{
              paddingVertical: verticalScale(6),
              paddingHorizontal: scale(14),
              borderRadius: scale(10),
              borderWidth: 1,
              borderColor: '#F44336',
              marginRight: scale(8),
            }}
          >
            <Text
              style={{
                fontSize: scaleFont(12),
                color: '#F44336',
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAccept}
            style={{
              paddingVertical: verticalScale(6),
              paddingHorizontal: scale(14),
              borderRadius: scale(10),
              backgroundColor: '#4CAF50',
            }}
          >
            <Text
              style={{
                fontSize: scaleFont(12),
                color: '#fff',
              }}
            >
              Approve
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
