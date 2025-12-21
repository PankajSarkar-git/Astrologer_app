import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { scale, scaleFont, verticalScale } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';
import { textStyle } from '../../../constant/text-style';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';

type BookingCardProps = {
  item: any;
  onAccept?: (payload: { id: string; status: string; otp: null }) => void;
  onReject?: (payload: { id: string; status: string; otp: null }) => void;
  onStartSession?: (item: any) => void;
};

export const BookingCard = ({
  item,
  onAccept,
  onReject,
  onStartSession,
}: BookingCardProps) => {
  const getStatusColor = (status: any) => {
    if (status === 'PENDING') return '#FFA726';
    if (status === 'CONFIRMED') return '#42A5F5';
    if (status === 'COMPLETED') return '#4CAF50';
    if (status === 'CANCELLED') return '#F44336';
    return COLORS.theme.gray.light;
  };

  const getSessionTypeIcon = (type: any) => {
    if (type === 'CHAT') return '💬';
    if (type === 'VIDEO') return '📹';
    return '📞';
  };

  const isPending = item.status === 'PENDING' || item.status === null;
  const isApproved = item.status === 'APPROVED';

  const sessionLabel =
    item.sessionType === 'CHAT'
      ? 'Start Chat'
      : item.sessionType === 'VIDEO'
      ? 'Start Video'
      : 'Start Call';

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
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{
            uri: item.user?.imgUri || 'https://i.postimg.cc/52hKjTgP/user.png',
          }}
          style={{
            width: scale(46),
            height: scale(46),
            borderRadius: 100,
            marginRight: scale(12),
          }}
        />

        <View style={{ flex: 1 }}>
          <Text style={textStyle.fs_mont_16_600}>{item.user?.name}</Text>
          <Text style={{ fontSize: scaleFont(12), marginTop: 2 }}>
            {getSessionTypeIcon(item.sessionType)} {item.sessionType}
          </Text>
        </View>

        {/* STATUS */}
        <View
          style={{
            backgroundColor: getStatusColor(item.status),
            paddingHorizontal: scale(10),
            paddingVertical: verticalScale(4),
            borderRadius: scale(12),
          }}
        >
          <Text style={{ color: '#fff', fontSize: scaleFont(12) }}>
            {item.status || 'PENDING'}
          </Text>
        </View>
      </View>

      {/* DETAILS */}
      <Text style={{ marginTop: 10, fontSize: scaleFont(12) }}>
        📅 {item.appointmentDate} ⏱️ {item.appointmentDuration} mins
      </Text>

      {item.reason ? (
        <Text style={{ marginTop: 6, fontSize: scaleFont(12) }}>
          Reason: {item.reason}
        </Text>
      ) : null}

      {item.user.mobile ? (
        <Text style={{ marginTop: 6, fontSize: scaleFont(12) }}>
          Mobile: {item.user.mobile}
        </Text>
      ) : null}

      {/* PENDING → Approve + Cancel */}
      {isPending && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: verticalScale(12),
          }}
        >
          {/* Cancel */}
          <TouchableOpacity
            onPress={() =>
              onReject?.({
                id: item.id,
                status: 'CANCEL',
                otp: null,
              })
            }
            style={{
              paddingVertical: verticalScale(6),
              paddingHorizontal: scale(14),
              borderRadius: scale(10),
              borderWidth: 1,
              borderColor: '#F44336',
              marginRight: scale(8),
            }}
          >
            <Text style={{ fontSize: scaleFont(12), color: '#F44336' }}>
              Cancel
            </Text>
          </TouchableOpacity>

          {/* Approve */}
          <TouchableOpacity
            onPress={() =>
              onAccept?.({
                id: item.id,
                status: 'CONFIRM',
                otp: null,
              })
            }
            style={{
              paddingVertical: verticalScale(6),
              paddingHorizontal: scale(14),
              borderRadius: scale(10),
              backgroundColor: '#4CAF50',
            }}
          >
            <Text style={{ fontSize: scaleFont(12), color: '#fff' }}>
              Approve
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* APPROVED → Start Session */}
      {isApproved && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: verticalScale(12),
          }}
        >
          <TouchableOpacity
            onPress={() => onStartSession?.(item)}
            style={{
              paddingVertical: verticalScale(6),
              paddingHorizontal: scale(16),
              borderRadius: scale(10),
              backgroundColor: '#42A5F5',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scaleFont(13) }}>
              {sessionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <ZegoSendCallInvitationButton
        invitees={[{ userID: item.user.mobile, userName: item.user.name }]}
        isVideoCall={false}
        resourceID={'zego_call'}
      /> */}
    </View>
  );
};
