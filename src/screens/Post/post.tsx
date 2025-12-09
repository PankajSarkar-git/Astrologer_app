// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from 'react-native';
// import React, { useState } from 'react';
// import PageWithHeader from '../../components/layout/page-with-header';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { COLORS } from '../../constant/colors';
// import { useCreatePost } from '../../api/hooks/usePosts';
// import { showToast } from '../../components/common/toast';

// const Post = () => {
//   const [text, setText] = useState('');
//   const [images, setImages] = useState<string[]>([]);
//   const { mutate: createPost, isPending: creating } = useCreatePost();

//   // Pick Image
//   const pickImage = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         selectionLimit: 5,
//         quality: 0.8,
//       },
//       response => {
//         if (response.didCancel) return;

//         if (response.assets) {
//           const selected = response.assets.map(a => a.uri!);
//           setImages(prev => [...prev, ...selected]);
//         }
//       },
//     );
//   };

//   // Remove Image
//   const removeImage = (index: number) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = () => {
//     if (!text.trim()) {
//       return showToast({ type: 'error', message: 'Write something first' });
//     }

//     const payload = {
//       text,
//       images, // send array of image URIs
//     };

//     createPost(payload);
//   };

//   return (
//     <PageWithHeader>
//       <ScrollView className="flex-1 bg-[#fafafa] p-4">
//         {/* Heading */}
//         <Text className="mb-4 text-2xl font-semibold text-black">
//           Share Your Post
//         </Text>

//         {/* Card Wrapper */}
//         <View
//           className="rounded-2xl p-4 shadow-sm"
//           style={{ backgroundColor: COLORS.theme.white }}
//         >
//           {/* Text Input */}
//           <TextInput
//             value={text}
//             onChangeText={setText}
//             multiline
//             placeholder="Write something interesting..."
//             placeholderTextColor={COLORS.theme.gray.text + '70'}
//             className="max-h-[400px] min-h-[150px] text-base text-black"
//             textAlignVertical="top"
//           />

//           {/* Images Section */}
//           <View className="mt-3 flex-row flex-wrap">
//             {images.map((img, index) => (
//               <View key={index} className="relative m-1">
//                 {/* Preview */}
//                 <Image source={{ uri: img }} className="h-24 w-24 rounded-lg" />

//                 {/* Delete Icon */}
//                 <TouchableOpacity
//                   onPress={() => removeImage(index)}
//                   className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full"
//                   style={{
//                     backgroundColor: COLORS.status.error.base.replace('#', ''),
//                   }}
//                 >
//                   <Text className="text-xs font-bold text-white">X</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}

//             {/* Add Image Button */}
//             <TouchableOpacity
//               onPress={pickImage}
//               className="m-1 h-24 w-24 items-center justify-center rounded-lg border border-gray-300"
//             >
//               <Text className="text-lg text-gray-500">+</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Publish Button */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           className="my-6 w-full rounded-xl py-3"
//           style={{ backgroundColor: COLORS.theme.primary }}
//         >
//           <Text className="text-center text-base font-semibold text-white">
//             Publish Post
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </PageWithHeader>
//   );
// };

// export default Post;

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from 'react-native';
// import React, { useState } from 'react';
// import PageWithHeader from '../../components/layout/page-with-header';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { COLORS } from '../../constant/colors';
// import { useCreatePost } from '../../api/hooks/usePosts';
// import { showToast } from '../../components/common/toast';

// const Post = () => {
//   const [text, setText] = useState('');
//   const [files, setFiles] = useState<any[]>([]); // multiple selected images
//   const { mutate: createPost, isPending: creating } = useCreatePost();

//   // Pick multiple images
//   const pickImage = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         selectionLimit: 5,
//         quality: 0.8,
//       },
//       response => {
//         if (response.didCancel) return;
//         if (!response.assets) return;

//         const newFiles = response.assets.map(a => ({
//           uri: a.uri,
//           type: a.type ?? 'image/jpeg',
//           name: a.fileName ?? `image_${Date.now()}.jpg`,
//         }));

//         setFiles(prev => [...prev, ...newFiles]);
//       },
//     );
//   };

//   // Remove image
//   const removeImage = (index: number) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   // Submit post (FormData)
//   const handleSubmit = () => {
//     if (!text.trim()) {
//       return showToast({ type: 'error', message: 'Write something first' });
//     }

//     const postData = {
//       text,
//       images, // array of image URIs
//     };

//     const formData = new FormData();

//     // JSON as string (React Native safe)
//     formData.append('data', JSON.stringify(postData));

//     // No image files, only image URIs inside JSON.

//     createPost(formData);
//   };

//   return (
//     <PageWithHeader>
//       <ScrollView className="flex-1 bg-[#fafafa] p-4">
//         <Text className="mb-4 text-2xl font-semibold text-black">
//           Share Your Post
//         </Text>

//         <View
//           className="rounded-2xl p-4 shadow-sm"
//           style={{ backgroundColor: COLORS.theme.white }}
//         >
//           <TextInput
//             value={text}
//             onChangeText={setText}
//             multiline
//             placeholder="Write something interesting..."
//             placeholderTextColor={COLORS.theme.gray.text + '70'}
//             className="max-h-[400px] min-h-[150px] text-base text-black"
//             textAlignVertical="top"
//           />

//           {/* Images */}
//           <View className="mt-3 flex-row flex-wrap">
//             {files.map((file, index) => (
//               <View key={index} className="relative m-1">
//                 <Image
//                   source={{ uri: file.uri }}
//                   className="h-24 w-24 rounded-lg"
//                 />

//                 <TouchableOpacity
//                   onPress={() => removeImage(index)}
//                   className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
//                 >
//                   <Text className="text-xs font-bold text-white">X</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}

//             <TouchableOpacity
//               onPress={pickImage}
//               className="m-1 h-24 w-24 items-center justify-center rounded-lg border border-gray-300"
//             >
//               <Text className="text-lg text-gray-500">+</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Submit */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           disabled={creating}
//           className="my-6 w-full rounded-xl py-3"
//           style={{
//             backgroundColor: COLORS.theme.primary,
//             opacity: creating ? 0.5 : 1,
//           }}
//         >
//           <Text className="text-center text-base font-semibold text-white">
//             {creating ? 'Publishing...' : 'Publish Post'}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </PageWithHeader>
//   );
// };

// export default Post;

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import PageWithHeader from '../../components/layout/page-with-header';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constant/colors';
import { useCreatePost } from '../../api/hooks/usePosts';
import { showToast } from '../../components/common/toast';

const Post = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const { mutate: createPost, isPending: creating } = useCreatePost();

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (!response.assets) return;

        const selected = response.assets.map(a => ({
          uri: a.uri,
          type: a.type ?? 'image/jpeg',
          name: a.fileName ?? `image_${Date.now()}.jpg`,
        }));

        setFiles(prev => [...prev, ...selected]);
      },
    );
  };

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      showToast({ type: 'error', message: 'Write something first' });
      return;
    }

    const postData = {
      text: text.trim(),
      images: files.map(f => f.uri),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(postData));

    createPost(formData);
  };

  return (
    <PageWithHeader>
      <ScrollView className="flex-1 bg-[#fafafa] p-4">
        <Text className="mb-4 text-2xl font-semibold text-black">
          Share Your Post
        </Text>

        <View
          className="rounded-2xl p-4 shadow-sm"
          style={{ backgroundColor: COLORS.theme.white }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Write something interesting..."
            placeholderTextColor={COLORS.theme.gray.text + '70'}
            className="max-h-[400px] min-h-[150px] text-base text-black"
            textAlignVertical="top"
          />

          <View className="mt-3 flex-row flex-wrap">
            {files.map((file, i) => (
              <View key={i} className="relative m-1">
                <Image
                  source={{ uri: file.uri }}
                  className="h-24 w-24 rounded-lg"
                />

                <TouchableOpacity
                  onPress={() => removeImage(i)}
                  className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
                >
                  <Text className="text-xs font-bold text-white">X</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={pickImage}
              className="m-1 h-24 w-24 items-center justify-center rounded-lg border border-gray-300"
            >
              <Text className="text-lg text-gray-500">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={creating}
          className="my-6 w-full rounded-xl py-3"
          style={{
            backgroundColor: COLORS.theme.primary,
            opacity: creating ? 0.5 : 1,
          }}
        >
          <Text className="text-center text-base font-semibold text-white">
            {creating ? 'Publishing...' : 'Publish Post'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </PageWithHeader>
  );
};

export default Post;
