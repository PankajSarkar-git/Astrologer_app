import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import EditIcon from '../../assets/icon/edit-icon';
import HomeIcon from '../../assets/icons/home-icon';

import {
  moderateScale,
  scale,
  scaleFont,
  verticalScale,
} from '../../utils/sizer';
import { COLORS } from '../../constant/colors';

import { useUserRole } from '../../hooks/use-role';
import { useAppSelector } from '../../hooks/redux-hook';
import PageWithHeader from '../../components/layout/page-with-header';
import { useAstrologerDetail, useChangeAstrologerOnline } from '../../api/hooks/useAstrologers';
import { Switch } from 'react-native';


const ProfilePage = () => {
  const role = useUserRole();
  const isAstrologer = role === 'ASTROLOGER';

  const { astroId } = useAppSelector(state => state.auth);
  const navigation = useNavigation<any>();

  const { data, isLoading, refetch } = useAstrologerDetail(astroId);

  const {
    mutate: changeOnline,
    isPending: updatingStatus,
  } = useChangeAstrologerOnline(astroId);



  useEffect(() => {
    refetch();
  }, []);

  const profileData = data?.astrologer;
  console.log(profileData, "----profile data")
  /* ---------- AVATAR ---------- */
  const avatar =
    profileData?.user?.imgUri ||
    (profileData?.user?.gender === 'FEMALE'
      ? 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'
      : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d');

  if (isAstrologer && isLoading) {
    return (
      <PageWithHeader themeMode="light">
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.theme.primary} />
        </View>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader title="Profile">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ================= PROFILE CARD ================= */}
        <View style={styles.profileCard}>
          <Image source={{ uri: avatar }} style={styles.avatar} />

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {profileData?.user?.name ?? 'Unnamed'}
            </Text>
            <Text style={styles.phone}>
              {profileData?.user?.mobile
                ? `+91 ${profileData.user.mobile}`
                : '__'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('ProfileEdit', { id: astroId })}
          >
            <EditIcon size={18} color={COLORS.theme.primary} />
          </TouchableOpacity>
        </View>

        {/* ================= PERSONAL INFO ================= */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <InfoRow label="Name" value={profileData?.user?.name} />
          <InfoRow label="Gender" value={profileData?.user?.gender} />
        </View>

        {/* ================= PROFESSIONAL INFO ================= */}
        {isAstrologer && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Professional Details</Text>

            <InfoRow label="Expertise" value={profileData?.expertise} />

            <InfoRow
              label="Experience"
              value={
                profileData?.experienceYears !== null
                  ? `${profileData?.experienceYears} years`
                  : '__'
              }
            />

            <InfoRow
              label="Chat Price"
              value={
                profileData?.pricePerMinuteChat !== null
                  ? `₹${profileData?.pricePerMinuteChat}/min`
                  : '__'
              }
            />

            <InfoRow
              label="Voice Call Price"
              value={
                profileData?.pricePerMinuteVoice !== null
                  ? `₹${profileData?.pricePerMinuteVoice}/min`
                  : '__'
              }
            />

            <InfoRow
              label="Video Call Price"
              value={
                profileData?.pricePerMinuteVideo !== null
                  ? `₹${profileData?.pricePerMinuteVideo}/min`
                  : '__'
              }
            />
          </View>
        )}

        {/* ================= ABOUT ================= */}
        {isAstrologer && profileData?.about && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.aboutText}>{profileData.about}</Text>
          </View>
        )}

        {/* ================= ADDRESS (USER ONLY) ================= */}
        {!isAstrologer && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <HomeIcon size={14} color={COLORS.theme.primary} /> Address
            </Text>
            <Text style={styles.aboutText}>
              {profileData?.user?.birthPlace ?? '__'}
            </Text>
          </View>
        )}

        {/* ================= ONLINE STATUS ================= */}
        {isAstrologer && (
          <View style={[styles.card, { marginBottom: 80 }]}>
            <Text style={styles.cardTitle}>
              Availability Status
            </Text>

            {/* CHAT */}
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>
                  Chat
                </Text>

                <Text style={styles.statusText}>
                  {profileData?.isChatOnline
                    ? 'Online'
                    : 'Offline'}
                </Text>
              </View>

              <Switch
                value={
                  !!profileData?.isChatOnline
                }
                disabled={updatingStatus}
                trackColor={{
                  false:
                    COLORS.theme.gray.light,
                  true: COLORS.theme.primary,
                }}
                thumbColor={
                  COLORS.theme.white
                }
                onValueChange={value => {
                  changeOnline({
                    onlineType:
                      'CHATONLINE',
                    status: value,
                  });
                }}
              />
            </View>

            {/* AUDIO */}
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>
                  Audio Call
                </Text>

                <Text style={styles.statusText}>
                  {profileData?.isAudioOnline
                    ? 'Online'
                    : 'Offline'}
                </Text>
              </View>

              <Switch
                value={
                  !!profileData?.isAudioOnline
                }
                disabled={updatingStatus}
                trackColor={{
                  false:
                    COLORS.theme.gray.light,
                  true: COLORS.theme.primary,
                }}
                thumbColor={
                  COLORS.theme.white
                }
                onValueChange={value => {
                  changeOnline({
                    onlineType:
                      'AUDIOONLINE',
                    status: value,
                  });
                }}
              />
            </View>

            {/* VIDEO */}
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>
                  Video Call
                </Text>

                <Text style={styles.statusText}>
                  {profileData?.isVideoOnline
                    ? 'Online'
                    : 'Offline'}
                </Text>
              </View>

              <Switch
                value={
                  !!profileData?.isVideoOnline
                }
                disabled={updatingStatus}
                trackColor={{
                  false:
                    COLORS.theme.gray.light,
                  true: COLORS.theme.primary,
                }}
                thumbColor={
                  COLORS.theme.white
                }
                onValueChange={value => {
                  changeOnline({
                    onlineType:
                      'VIDEOONLINE',
                    status: value,
                  });
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </PageWithHeader>
  );
};

export default ProfilePage;

/* ================= INFO ROW ================= */
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '__'}</Text>
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme.white,
    padding: scale(16),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.theme.white,
    padding: scale(16),
    borderRadius: 16,
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  avatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(20),
    marginRight: scale(14),
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: COLORS.theme.black,
  },
  phone: {
    fontSize: scaleFont(14),
    color: COLORS.theme.gray.text,
    marginTop: 4,
  },
  editBtn: {
    padding: moderateScale(8),
  },

  card: {
    backgroundColor: COLORS.theme.white,
    borderRadius: 16,
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  cardTitle: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    color: COLORS.theme.black,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: scaleFont(13),
    color: COLORS.theme.gray.text,
  },
  infoValue: {
    fontSize: scaleFont(13),
    fontWeight: '500',
    color: COLORS.theme.black,
    maxWidth: '55%',
    textAlign: 'right',
  },

  aboutText: {
    fontSize: scaleFont(14),
    color: COLORS.theme.gray.text,
    lineHeight: 20,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.theme.gray.light,
  },

  statusLabel: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: COLORS.theme.black,
  },

  statusText: {
    fontSize: scaleFont(12),
    color: COLORS.theme.gray.text,
    marginTop: 2,
  },
});
