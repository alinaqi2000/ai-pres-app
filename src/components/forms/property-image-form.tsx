import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { Button as RNButton } from 'react-native-paper';

import { ImagePlus } from '@/components/ui/icons/image-plus';
import {
  setEditImages,
  setEditThumbnail,
  usePropertyStore,
} from '@/lib/store/my-properties';

import { Button, Text } from '../ui';
import { Trash } from '../ui/icons';

export type PropertyImageFormProps = {
  onSubmitThumbnail: (data: { thumbnail: any }) => void;
  onSubmitImage: (data: { image: any }) => void;
  onSubmitDeleteImage: (imageId: number, isThumbnail?: boolean) => void;
};

// eslint-disable-next-line max-lines-per-function
export const PropertyImageForm = ({
  onSubmitThumbnail,
  onSubmitImage,
  onSubmitDeleteImage,
}: PropertyImageFormProps) => {
  const { colorScheme } = useColorScheme();
  const editProperty = usePropertyStore.use.editProperty();
  const editThumbnail = usePropertyStore.use.editThumbnail();
  const editImages = usePropertyStore.use.editImages();
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);

  React.useEffect(() => {
    if (editProperty?.thumbnail) {
      setEditThumbnail(editProperty.thumbnail);
    }
    if (editProperty?.images) {
      setEditImages(editProperty.images);
    }
    return () => {
      // setThumbnail(null);
      // setEditThumbnail(null);
      // setImages([]);
      // setEditImages([]);
    };
  }, []);

  React.useEffect(() => {
    setThumbnail(null);
  }, [editThumbnail]);

  React.useEffect(() => {
    setImages([]);
  }, [editImages]);

  const pickImage = async (isThumbnail = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (isThumbnail) {
        setThumbnail(result.assets[0]);
        onSubmitThumbnail({ thumbnail: result.assets[0] });
      } else {
        setImages((prev) => [...prev, result.assets[0]]);
        onSubmitImage({ image: result.assets[0] });
      }
    }
  };

  return (
    <View style={{ gap: 24 }}>
      <View className="flex-col gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">Thumbnail</Text>
          {(thumbnail || editThumbnail) && (
            <View className="flex-row items-center gap-2">
              <Button
                variant="destructive"
                onPress={() => {
                  onSubmitDeleteImage(editThumbnail?.id ?? 0, true);
                }}
                icon={<Trash />}
              />
              <RNButton
                icon="pencil"
                textColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
                contentStyle={{ flexDirection: 'row-reverse' }}
                labelStyle={{ fontSize: 11 }}
                mode="contained"
                style={{
                  backgroundColor:
                    colorScheme === 'dark' ? '#ffffff' : '#000000',
                }}
                onPress={() => pickImage(true)}
              >
                Update
              </RNButton>
            </View>
          )}
        </View>
        {thumbnail || editThumbnail ? (
          <View style={{ marginBottom: 8, alignItems: 'center' }}>
            <Image
              resizeMode="cover"
              source={{ uri: thumbnail?.uri || editThumbnail?.image_url }}
              style={{ width: '100%', height: 128, borderRadius: 8 }}
            />
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Button
              style={{ height: 128 }}
              className="w-full"
              variant="outline"
              label="Select Thumbnail"
              icon={
                <ImagePlus
                  stroke={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                />
              }
              onPress={() => pickImage(true)}
            />
          </View>
        )}
      </View>

      <View className="flex-col gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">Other Images</Text>
          {(images.length > 0 || editImages.length > 0) &&
            editImages.length < 3 && (
              <RNButton
                icon="plus"
                textColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
                contentStyle={{ flexDirection: 'row-reverse' }}
                labelStyle={{ fontSize: 11 }}
                mode="contained"
                style={{
                  backgroundColor:
                    colorScheme === 'dark' ? '#ffffff' : '#000000',
                }}
                onPress={() => pickImage(false)}
              >
                Add
              </RNButton>
            )}
        </View>
        {images.length > 0 || editImages.length > 0 ? (
          <View
            style={{
              marginBottom: 8,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {(images[0]?.uri || editImages[0]?.image_url) && (
              <View style={{ width: '45%' }}>
                <Image
                  resizeMode="cover"
                  source={{ uri: images[0]?.uri ?? editImages[0]?.image_url }}
                  style={{ width: '100%', height: 128, borderRadius: 8 }}
                />
                <Button
                  variant="destructive"
                  className="absolute right-2 top-2"
                  onPress={() => {
                    onSubmitDeleteImage(editImages[0]?.id ?? 0);
                  }}
                  icon={<Trash />}
                />
              </View>
            )}
            {(images[1]?.uri || editImages[1]?.image_url) && (
              <View style={{ width: '45%' }}>
                <Image
                  resizeMode="cover"
                  source={{ uri: images[1]?.uri ?? editImages[1]?.image_url }}
                  style={{ width: '100%', height: 128, borderRadius: 8 }}
                />
                <Button
                  variant="destructive"
                  className="absolute right-2 top-2"
                  onPress={() => {
                    onSubmitDeleteImage(editImages[1]?.id ?? 0);
                  }}
                  icon={<Trash />}
                />
              </View>
            )}
            {(images[2]?.uri || editImages[2]?.image_url) && (
              <View style={{ width: '45%' }}>
                <Image
                  resizeMode="cover"
                  source={{ uri: images[2]?.uri ?? editImages[2]?.image_url }}
                  style={{ width: '100%', height: 128, borderRadius: 8 }}
                />
                <Button
                  variant="destructive"
                  className="absolute right-2 top-2"
                  onPress={() => {
                    onSubmitDeleteImage(editImages[2]?.id ?? 0);
                  }}
                  icon={<Trash />}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Button
              style={{ height: 128 }}
              className="w-full"
              variant="outline"
              label="Select Images"
              icon={
                <ImagePlus
                  stroke={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                />
              }
              onPress={() => pickImage(false)}
            />
          </View>
        )}
      </View>
    </View>
  );
};
