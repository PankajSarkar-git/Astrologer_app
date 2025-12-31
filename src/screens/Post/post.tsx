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

  const { mutate: createPost, isPending: creating } = useCreatePost({
    onSuccess: () => {
      setText('');
      setFiles([]);
      showToast({ type: 'success', message: 'Post published successfully' });
    },
  });

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5,
        quality: 0.8,
      },
      response => {
        if (response.didCancel || !response.assets) return;

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

  // const handleSubmit = () => {
  //   if (!text.trim()) {
  //     return showToast({ type: 'error', message: 'Write something first' });
  //   }

  //   const formData = new FormData();
  //   formData.append(
  //     'data',
  //     new Blob([JSON.stringify({ text: text })], {
  //       type: 'application/json',
  //       lastModified: Date.now(),
  //     }),
  //   );
  //   if (files.length !== 0) {
  //     formData.append('images', files);
  //   }

  //   createPost(formData);
  //   console.log(formData, 'formData');
  // };

  // const handleSubmit = () => {
  //   if (!text.trim()) {
  //     return showToast({ type: 'error', message: 'Write something first' });
  //   }

  //   const formData = new FormData();

  //   const jsonBlob = new Blob([JSON.stringify({ text })], {
  //     type: 'application/json',
  //     lastModified: Date.now(),
  //   });

  //   formData.append('data', jsonBlob);

  //   files.forEach(file => {
  //     formData.append('images', file);
  //   });

  //   createPost(formData);
  // };

  const handleSubmit = () => {
    if (!text.trim()) {
      return showToast({ type: 'error', message: 'Write something first' });
    }

    const formData = new FormData();

    formData.append('text', text);

    files.forEach((file, index) => {
      formData.append('images', file);
    });
    createPost(formData);
  };

  return (
    <PageWithHeader scrollEnabled title="Post">
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
