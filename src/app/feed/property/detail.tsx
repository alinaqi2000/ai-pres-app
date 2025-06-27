import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Image as RNImage, ScrollView, StyleSheet, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { Button, Chip, Icon, Text, TouchableRipple } from 'react-native-paper';

import HeadBar from '@/components/head-bar';
import { colors } from '@/components/ui';
import { toTitleCase } from '@/lib';
import { usePropertyStore } from '@/lib/store/my-properties';

export default function PropertyDetail() {
  const property = usePropertyStore.use.currentProperty();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const styles = StyleSheet.create({
    mainImage: {
      width: '100%',
      height: 300,
    },
    galleryImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
  });

  const [activeImageIndex, setActiveImageIndex] = useState(-1);

  const handleImagePress = (index: number) => {
    setActiveImageIndex(index);
  };

  if (!property) {
    return router.back();
  }

  return (
    <View className="flex-1">
      <HeadBar title={property.name} />

      {/* Image Gallery */}
      <View className="relative mt-4">
        {property.thumbnail ? (
          <RNImage
            source={{ uri: property.thumbnail?.image_url }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View className="h-32 bg-gray-200" />
        )}
        <View className="absolute inset-x-4 bottom-4 flex-row items-center justify-between">
          {/* <Chip
            style={{
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
              paddingHorizontal: 12,
            }}
            textStyle={{
              color: colorScheme === 'dark' ? 'white' : 'black',
            }}
          >
            {toTitleCase(property.is_published ? 'Published' : 'Private')}
          </Chip> */}
          <Chip
            style={{
              backgroundColor:
                colorScheme === 'dark' ? colors.white : colors.black,
              paddingHorizontal: 12,
            }}
            textStyle={{
              color: colorScheme === 'dark' ? 'black' : 'white',
            }}
          >
            Rs
            {property.monthly_rent
              ? property.monthly_rent.toLocaleString()
              : 'N/A'}
            /month
          </Chip>
        </View>
      </View>

      {/* Property Details */}
      <ScrollView className="p-6">
        {/* Property Info */}
        <View className="mb-2">
          <View className="flex-row items-center pt-1">
            <Icon source="pound" size={16} color={colors.primary[400]} />
            <Text variant="titleMedium" className="text-gray-600">
              {property.property_id} • {toTitleCase(property.name)}
            </Text>
          </View>
          <Text
            variant="bodyMedium"
            className="text-gray-600 dark:text-neutral-300"
          >
            {property.description}
          </Text>
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text variant="titleMedium" className="mb-2 font-medium">
            Location
          </Text>
          <View className="flex-row items-center gap-2">
            <Icon size={20} source="map-marker" color={colors.primary[500]} />
            <Text
              variant="bodyMedium"
              className="text-gray-600 dark:text-neutral-300"
            >
              {property.address}
            </Text>
          </View>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text variant="titleMedium" className="mb-2 font-medium">
            Features
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {property.meta?.total_floors ? (
              <Chip
                key="floors"
                style={{ backgroundColor: colors.primary[100] }}
                textStyle={{ color: colors.primary[700] }}
              >
                {property.meta.total_floors} Floors
              </Chip>
            ) : undefined}
            {property.meta?.total_units ? (
              <Chip
                key="available units"
                style={{ backgroundColor: colors.primary[100] }}
                textStyle={{ color: colors.primary[700] }}
              >
                {property.meta?.total_unoccupied_units}/
                {property.meta.total_units}
                Available Unit
                {property.meta?.total_units === 1 ? '' : 's'}
              </Chip>
            ) : undefined}
          </View>
        </View>

        {/* Image Gallery */}
        <View className="mb-6">
          <Text variant="titleMedium" className="mb-2 font-medium">
            Photos
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {property.images?.map((image, index) => (
              <TouchableRipple
                key={image.id}
                onPress={() => handleImagePress(index)}
                className="overflow-hidden rounded-lg"
              >
                <RNImage
                  source={{ uri: image.image_url }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableRipple>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View className="mb-6">
          <Text variant="titleMedium" className="mb-2 font-medium">
            Contact
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Icon size={20} source="email" color={colors.primary[500]} />
            <Text
              variant="bodyMedium"
              className="text-gray-600 dark:text-neutral-300"
            >
              {property.owner?.email || 'Contact information not available'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="mb-20 mt-8">
          <Button
            mode="contained"
            onPress={() => {
              router.push('/bookings/tenant/create-booking-request');
            }}
            className="rounded-lg"
          >
            {property.is_published ? 'Book Now' : 'Contact Owner'}
          </Button>
        </View>

        <ImageView
          images={property.images.map((image) => ({
            uri: image.image_url,
          }))}
          imageIndex={activeImageIndex}
          visible={activeImageIndex > -1}
          onRequestClose={() => setActiveImageIndex(-1)}
        />
      </ScrollView>
    </View>
  );
}
