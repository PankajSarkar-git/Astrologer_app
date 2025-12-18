// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { launchImageLibrary } from 'react-native-image-picker';

// import EditIcon from '../../assets/icon/edit-icon';
// import { scale, verticalScale } from '../../utils/sizer';
// import { COLORS } from '../../constant/colors';
// import { textStyle } from '../../constant/text-style';

// import PageWithHeader from '../../components/layout/page-with-header';
// import CustomInputV2 from '../../components/common/custom-input-v2';
// import CustomDateTimePicker from '../../components/common/custom-date-time-picker';
// import ControlledTagSelector from '../../components/common/controlled-tag-selector';
// import CustomButton from '../../components/common/custom-button';

// import { useAppSelector } from '../../hooks/redux-hook';
// import {
//   useAstrologerDetail,
//   useUpdateAstrologer,
// } from '../../api/hooks/useAstrologers';

// const genderTags = [
//   { id: 'MALE', label: 'Male' },
//   { id: 'FEMALE', label: 'Female' },
//   { id: 'OTHER', label: 'Other' },
// ];

// const AstrologerProfileEdit = () => {
//   const navigation = useNavigation<any>();
//   const { astroId } = useAppSelector(state => state.auth);

//   const astrologerId = astroId;

//   const { data } = useAstrologerDetail(astrologerId);
//   const { mutate: updateAstrologer, isPending } = useUpdateAstrologer();

//   const [errors, setErrors] = useState<string[]>([]);

//   const [profileImageUri, setProfileImageUri] = useState('');
//   const [newImageFile, setNewImageFile] = useState<any>(null);

//   const [form, setForm] = useState({
//     name: '',
//     gender: '',
//     expertise: '',
//     birthDate: '',
//     birthTime: '',
//     birthPlace: '',
//   });

//   /* ---------- PREFILL FROM API ---------- */
//   useEffect(() => {
//     if (!data) return;

//     setForm({
//       name: data.astrologer.user.name ?? '',
//       gender: data.astrologer.user.gender ?? '',
//       expertise: data.astrologer.expertise ?? '',
//       birthDate: data.astrologer.user.birthDate ?? '',
//       birthTime: data.astrologer.user.birthTime ?? '',
//       birthPlace: data.astrologer.user.birthPlace ?? '',
//     });

//     setProfileImageUri(data.astrologer.user.imgUri ?? '');
//     setNewImageFile(null);
//   }, [data]);

//   /* ---------- IMAGE PICK ---------- */
//   const handlePickImage = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
//       if (!res.assets?.length) return;

//       const asset = res.assets[0];
//       if (!asset.uri) return;

//       setProfileImageUri(asset.uri);

//       setNewImageFile({
//         uri: asset.uri,
//         name: asset.fileName || `astrologer-${astrologerId}.jpg`,
//         type: asset.type || 'image/jpeg',
//       });
//     });
//   };

//   /* ---------- CHANGE HANDLER ---------- */
//   const handleChange = (key: string, value: any) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   /* ---------- VALIDATION ---------- */
//   const validate = () => {
//     const errs: string[] = [];

//     if (!form.name.trim()) errs.push('Name is required');
//     if (!form.gender) errs.push('Gender is required');
//     if (!form.expertise.trim()) errs.push('Expertise is required');
//     if (!form.birthDate) errs.push('Date of birth is required');
//     if (!form.birthTime) errs.push('Time of birth is required');
//     if (!form.birthPlace.trim()) errs.push('Birth place is required');

//     setErrors(errs);
//     return errs.length === 0;
//   };

//   /* ---------- SUBMIT (FORMDATA) ---------- */
//   const handleSubmit = () => {
//     if (!validate()) return;

//     const formData = new FormData();
//     // formData.append('data', form);
//     formData.append(
//       'data',
//       new Blob([JSON.stringify(form)], {
//         type: 'application/json',
//         lastModified: Date.now(),
//       }),
//     );
//     if (newImageFile) {
//       formData.append('image', newImageFile);
//     }

//     console.log(formData, 'form----');

//     updateAstrologer(
//       {
//         id: astrologerId,
//         payload: formData,
//       },
//       {
//         onSuccess: () => {
//           navigation.goBack();
//         },
//       },
//     );
//   };

//   /* ---------- TIME HELPER ---------- */
//   const timeStringToDate = (time?: string) => {
//     const date = new Date();
//     if (!time) return date;

//     const [hh, mm, ss] = time.split(':').map(Number);
//     date.setHours(hh || 0);
//     date.setMinutes(mm || 0);
//     date.setSeconds(ss || 0);
//     date.setMilliseconds(0);

//     return date;
//   };

//   const fallbackImage =
//     'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

//   return (
//     <PageWithHeader>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.container}>
//           {/* PROFILE IMAGE */}
//           <View style={styles.avatarWrapper}>
//             <TouchableWithoutFeedback onPress={handlePickImage}>
//               <View>
//                 <Image
//                   source={{ uri: profileImageUri || fallbackImage }}
//                   style={styles.avatar}
//                 />
//                 <View style={styles.editIcon}>
//                   <EditIcon size={16} color={COLORS.theme.primary} />
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>

//           {/* FORM */}
//           <CustomInputV2
//             label="Name"
//             value={form.name}
//             onChangeText={v => handleChange('name', v)}
//           />

//           <CustomInputV2
//             label="Expertise"
//             value={form.expertise}
//             onChangeText={v => handleChange('expertise', v)}
//           />

//           <CustomDateTimePicker
//             label="Date of Birth"
//             mode="date"
//             value={form.birthDate ? new Date(form.birthDate) : new Date()}
//             onChange={d =>
//               handleChange('birthDate', d.toISOString().split('T')[0])
//             }
//           />

//           <CustomDateTimePicker
//             label="Time of Birth"
//             mode="time"
//             value={timeStringToDate(form.birthTime)}
//             onChange={t =>
//               handleChange('birthTime', t.toTimeString().split(' ')[0])
//             }
//           />

//           <ControlledTagSelector
//             label="Gender"
//             tags={genderTags}
//             selectedTags={form.gender ? [form.gender] : []}
//             onChange={ids => handleChange('gender', ids[0])}
//             valueType="id"
//             multiSelect={false}
//           />

//           <CustomInputV2
//             label="Birth Place"
//             value={form.birthPlace}
//             onChangeText={v => handleChange('birthPlace', v)}
//           />

//           {/* SAVE */}
//           <View style={{ marginTop: verticalScale(20) }}>
//             <CustomButton
//               loading={isPending}
//               title={isPending ? 'Saving...' : 'Save Changes'}
//               onPress={handleSubmit}
//             />
//           </View>

//           {/* ERRORS */}
//           {errors.length > 0 && (
//             <View style={{ marginTop: verticalScale(20) }}>
//               {errors.map((e, i) => (
//                 <Text
//                   key={i}
//                   style={[textStyle.fs_abyss_14_400, { color: 'red' }]}
//                 >
//                   • {e}
//                 </Text>
//               ))}
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </PageWithHeader>
//   );
// };

// export default AstrologerProfileEdit;

// /* ---------- STYLES ---------- */
// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: scale(20),
//     paddingVertical: verticalScale(20),
//     backgroundColor: COLORS.theme.white,
//   },
//   avatarWrapper: {
//     alignItems: 'center',
//     marginBottom: verticalScale(20),
//   },
//   avatar: {
//     width: scale(80),
//     height: scale(80),
//     borderRadius: scale(16),
//     borderWidth: 1,
//     borderColor: COLORS.theme.gray.light,
//   },
//   editIcon: {
//     position: 'absolute',
//     bottom: -4,
//     right: -4,
//     backgroundColor: COLORS.theme.white,
//     borderRadius: 10,
//     padding: 4,
//     borderWidth: 1,
//     borderColor: COLORS.theme.gray.light,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import EditIcon from '../../assets/icon/edit-icon';
import { scale, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';
import { textStyle } from '../../constant/text-style';

import PageWithHeader from '../../components/layout/page-with-header';
import CustomInputV2 from '../../components/common/custom-input-v2';
import CustomButton from '../../components/common/custom-button';

import { useAppSelector } from '../../hooks/redux-hook';
import {
  useAstrologerDetail,
  useUpdateAstrologer,
} from '../../api/hooks/useAstrologers';

const AstrologerProfileEdit = () => {
  const navigation = useNavigation<any>();
  const { astroId } = useAppSelector(state => state.auth);
  const astrologerId = astroId;

  const { data } = useAstrologerDetail(astrologerId);
  const { mutate: updateAstrologer, isPending } = useUpdateAstrologer();

  const [errors, setErrors] = useState<string[]>([]);
  const [profileImageUri, setProfileImageUri] = useState('');
  const [newImageFile, setNewImageFile] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    expertise: '',
    experienceYears: '',
    pricePerMinuteChat: '',
    pricePerMinuteVoice: '',
    pricePerMinuteVideo: '',
    about: '',
  });

  /* ---------- PREFILL ---------- */
  useEffect(() => {
    if (!data) return;

    const astro = data.astrologer;

    setForm({
      name: astro.user?.name ?? '',
      mobile: astro.user?.mobile ?? '',
      expertise: astro.expertise ?? '',
      experienceYears: String(astro.experienceYears ?? ''),
      pricePerMinuteChat: String(astro.pricePerMinuteChat ?? ''),
      pricePerMinuteVoice: String(astro.pricePerMinuteVoice ?? ''),
      pricePerMinuteVideo: String(astro.pricePerMinuteVideo ?? ''),
      about: astro.about ?? '',
    });

    setProfileImageUri(astro.user?.imgUri ?? '');
    setNewImageFile(null);
  }, [data]);

  /* ---------- IMAGE PICK ---------- */
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (!res.assets?.length) return;

      const asset = res.assets[0];
      if (!asset.uri) return;

      setProfileImageUri(asset.uri);
      setNewImageFile({
        uri: asset.uri,
        name: asset.fileName || `astrologer-${astrologerId}.jpg`,
        type: asset.type || 'image/jpeg',
      });
    });
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const errs: string[] = [];

    if (!form.name.trim()) errs.push('Name is required');
    if (!form.mobile.trim()) errs.push('Mobile is required');
    if (!form.expertise.trim()) errs.push('Expertise is required');
    if (!form.experienceYears) errs.push('Experience is required');
    if (!form.pricePerMinuteChat) errs.push('Chat price is required');
    if (!form.pricePerMinuteVoice) errs.push('Voice price is required');
    if (!form.pricePerMinuteVideo) errs.push('Video price is required');

    setErrors(errs);
    return errs.length === 0;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append('data', form);

    if (newImageFile) {
      formData.append('image', newImageFile);
    }

    updateAstrologer(
      { id: astrologerId, payload: formData },
      { onSuccess: () => navigation.goBack() },
    );
  };

  const fallbackImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  return (
    <PageWithHeader title="Edit Profile">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* IMAGE */}
          <View style={styles.avatarWrapper}>
            <TouchableWithoutFeedback onPress={handlePickImage}>
              <View>
                <Image
                  source={{ uri: profileImageUri || fallbackImage }}
                  style={styles.avatar}
                />
                <View style={styles.editIcon}>
                  <EditIcon size={16} color={COLORS.theme.primary} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* FORM */}
          <CustomInputV2
            label="Name"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
          />
          <CustomInputV2
            label="Mobile"
            keyboardType="phone-pad"
            value={form.mobile}
            onChangeText={v => handleChange('mobile', v)}
          />
          <CustomInputV2
            label="Expertise"
            value={form.expertise}
            onChangeText={v => handleChange('expertise', v)}
          />
          <CustomInputV2
            label="Experience (Years)"
            keyboardType="numeric"
            value={form.experienceYears}
            onChangeText={v => handleChange('experienceYears', v)}
          />
          <CustomInputV2
            label="Chat Price / Min"
            keyboardType="numeric"
            value={form.pricePerMinuteChat}
            onChangeText={v => handleChange('pricePerMinuteChat', v)}
          />
          <CustomInputV2
            label="Voice Price / Min"
            keyboardType="numeric"
            value={form.pricePerMinuteVoice}
            onChangeText={v => handleChange('pricePerMinuteVoice', v)}
          />
          <CustomInputV2
            label="Video Price / Min"
            keyboardType="numeric"
            value={form.pricePerMinuteVideo}
            onChangeText={v => handleChange('pricePerMinuteVideo', v)}
          />
          <CustomInputV2
            label="About"
            multiline
            value={form.about}
            onChangeText={v => handleChange('about', v)}
          />

          <View style={{ marginTop: verticalScale(20) }}>
            <CustomButton
              loading={isPending}
              title={isPending ? 'Saving...' : 'Save Changes'}
              onPress={handleSubmit}
            />
          </View>

          {errors.length > 0 && (
            <View style={{ marginTop: verticalScale(20) }}>
              {errors.map((e, i) => (
                <Text
                  key={i}
                  style={[textStyle.fs_abyss_14_400, { color: 'red' }]}
                >
                  • {e}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </PageWithHeader>
  );
};

export default AstrologerProfileEdit;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: COLORS.theme.white,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
  editIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.theme.white,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.theme.gray.light,
  },
});
