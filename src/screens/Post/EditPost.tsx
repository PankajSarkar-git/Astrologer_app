import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import PageWithHeader from '../../components/layout/page-with-header';
import { COLORS } from '../../constant/colors';
import { usePostDetail, useUpdatePost } from '../../api/hooks/usePosts';
import { showToast } from '../../components/common/toast';
import { RootStackParamList } from '../../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

type PostImage = {
  id: string;
  imagUrl: string;
};

const EditPost = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const { data, isLoading } = usePostDetail(id);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const [text, setText] = useState('');
  const [existingImages, setExistingImages] = useState<PostImage[]>([]);
  const [newFiles, setNewFiles] = useState<any[]>([]);

  // hydrate from API
  useEffect(() => {
    if (!data) return;

    setText(data.post.text ?? '');
    setExistingImages(data.post.images ?? []);
  }, [data]);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5,
        quality: 0.8,
      },
      res => {
        if (res.didCancel || !res.assets) return;

        const selected = res.assets.map(a => ({
          uri: a.uri!,
          type: a.type ?? 'image/jpeg',
          name: a.fileName ?? `image_${Date.now()}.jpg`,
        }));

        setNewFiles(prev => [...prev, ...selected]);
      },
    );
  };

  const removeExistingImage = (img: PostImage) => {
    setExistingImages(prev => prev.filter(i => i.id !== img.id));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (!text.trim()) {
      return showToast({ type: 'error', message: 'Write something first' });
    }

    const formData = new FormData();
    formData.append('text', text);

    newFiles.forEach(file => {
      formData.append('images', file);
    });

    updatePost(
      { id, payload: formData },
      {
        onSuccess: () => {
          showToast({ type: 'success', message: 'Post updated successfully' });
          navigation.goBack();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <PageWithHeader>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.theme.primary} />
        </View>
      </PageWithHeader>
    );
  }

  if (!data) {
    return (
      <PageWithHeader>
        <View className="flex-1 items-center justify-center">
          <Text>Post not found</Text>
        </View>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader scrollEnabled>
      <ScrollView className="flex-1 bg-[#fafafa] p-4">
        <Text className="mb-4 text-2xl font-semibold text-black">
          Edit Your Post
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
            {existingImages.map(img => (
              <View key={img.id} className="relative m-1">
                <Image
                  source={{ uri: img.imagUrl }}
                  className="h-24 w-24 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => removeExistingImage(img)}
                  className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
                >
                  <Text className="text-xs font-bold text-white">X</Text>
                </TouchableOpacity>
              </View>
            ))}

            {newFiles.map((file, i) => (
              <View key={i} className="relative m-1">
                <Image
                  source={{ uri: file.uri }}
                  className="h-24 w-24 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => removeNewImage(i)}
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
          onPress={handleUpdate}
          disabled={isPending}
          className="my-6 w-full rounded-xl py-3"
          style={{
            backgroundColor: COLORS.theme.primary,
            opacity: isPending ? 0.5 : 1,
          }}
        >
          <Text className="text-center text-base font-semibold text-white">
            {isPending ? 'Updating...' : 'Update Post'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </PageWithHeader>
  );
};

export default EditPost;
