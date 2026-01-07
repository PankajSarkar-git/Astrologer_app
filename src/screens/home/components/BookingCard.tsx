import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { scale, scaleFont, verticalScale } from '../../../utils/sizer';
import { COLORS } from '../../../constant/colors';
import { textStyle } from '../../../constant/text-style';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';

type BookingCardProps = {
  item: any;
  onAccept?: (payload: { id: string }) => void;
  onReject?: (payload: { id: string }) => void;
  onComplete?: (payload: { id: string }) => void;
  onStartSession?: (item: any) => void;
};

export const BookingCard = ({
  item,
  onAccept,
  onReject,
  onStartSession,
  onComplete,
}: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    if (status === 'PENDING') return '#FFA726';
    if (status === 'APPROVED') return '#42A5F5';
    if (status === 'COMPLETED') return '#4CAF50';
    if (status === 'CANCELLED') return '#F44336';
    return COLORS.theme.gray.light;
  };

  const isPending = item.status === 'PENDING' || item.status === null;
  const isApproved = item.status === 'APPROVED';
  const isCompleted = item.status === 'COMPLETED';
  const sessionLabel =
    item.sessionType === 'CHAT'
      ? 'Start Chat'
      : item.sessionType === 'VIDEO'
      ? 'Start Video'
      : 'Start Call';

  const AVATAR_COLORS = [
    '#EF5350',
    '#AB47BC',
    '#5C6BC0',
    '#29B6F6',
    '#26A69A',
    '#66BB6A',
    '#FFA726',
    '#8D6E63',
  ];

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (key?: string) => {
    if (!key) return AVATAR_COLORS[0];
    const index = key.length % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

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
        {item.user?.imgUri ? (
          <Image
            source={{ uri: item.user.imgUri }}
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: 100,
              marginRight: scale(12),
            }}
          />
        ) : (
          <View
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: 100,
              marginRight: scale(12),
              backgroundColor: getAvatarColor(item.user?.name),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: scaleFont(16),
                fontWeight: '600',
              }}
            >
              {getInitials(item.user?.name)}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={textStyle.fs_mont_16_600}>{item.user?.name}</Text>
          <Text style={{ fontSize: scaleFont(12), marginTop: 2 }}>
            {item.sessionType}
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
            {item.status || 'PENDING'}
          </Text>
        </View>
      </View>

      {/* DETAILS */}
      <View
        style={{
          marginTop: verticalScale(12),
          backgroundColor: '#F8F9FA',
          borderRadius: scale(15),
          padding: scale(12),
        }}
      >
        {/* Date & Time */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: scaleFont(13) }}>📅</Text>
          <Text
            style={{
              marginLeft: 6,
              fontSize: scaleFont(12),
              color: COLORS.theme.gray.text,
            }}
          >
            {item.appointmentDate}
            {item.bookingType === 'ONLINE' &&
              ` • ${item.appointmentDuration} mins`}
          </Text>
        </View>

        {/* Mobile */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: scaleFont(13) }}>📞</Text>
          <Text
            style={{
              marginLeft: 6,
              fontSize: scaleFont(12),
              color: COLORS.theme.gray.text,
            }}
          >
            {item.user.mobile}
          </Text>
        </View>

        {/* Booking type */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: scaleFont(13) }}>💼</Text>
          <Text
            style={{
              marginLeft: 6,
              fontSize: scaleFont(12),
              fontWeight: '500',
              color:
                item.bookingType === 'ONLINE'
                  ? '#42A5F5'
                  : COLORS.theme.gray.text,
            }}
          >
            {item.bookingType}
          </Text>
        </View>
      </View>

      {/* PENDING ACTIONS */}
      {!isCompleted && isPending && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: verticalScale(12),
          }}
        >
          <TouchableOpacity
            onPress={() =>
              onReject?.({
                id: item.id,
              })
            }
            style={{
              paddingVertical: verticalScale(10),
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

          <TouchableOpacity
            onPress={() =>
              onAccept?.({
                id: item.id,
              })
            }
            style={{
              paddingVertical: verticalScale(10),
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

      {/* APPROVED ACTIONS */}
      {!isCompleted && isApproved && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: verticalScale(12),
          }}
        >
          {item.sessionType === 'AUDIO' && (
            <View style={{ paddingHorizontal: verticalScale(10) }}>
              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: item?.callSession?.user?.mobile,
                    userName: item?.user?.name?.slice(0, 20),
                  },
                ]}
                isVideoCall={false}
                resourceID="astrosevaa"
              />
            </View>
          )}

          {item.sessionType === 'VIDEO' && (
            <View style={{ paddingHorizontal: verticalScale(10) }}>
              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: item?.callSession?.user?.mobile,
                    userName: item?.user?.name?.slice(0, 20),
                  },
                ]}
                isVideoCall={true}
                resourceID="astrosevaa"
              />
            </View>
          )}

          {item.sessionType === 'CHAT' && (
            <TouchableOpacity
              onPress={() => onStartSession?.(item)}
              style={{
                paddingVertical: verticalScale(10),
                paddingHorizontal: scale(16),
                borderRadius: scale(10),
                backgroundColor: '#42A5F5',
                marginRight: scale(8),
              }}
            >
              <Text style={{ color: '#fff', fontSize: scaleFont(13) }}>
                {sessionLabel}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              onComplete?.({
                id: item.id,
              })
            }
            style={{
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(16),
              borderRadius: scale(10),
              backgroundColor: '#4CAF50',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scaleFont(13) }}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
