import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button as RNButton, Divider } from 'react-native-paper';
import { z } from 'zod';

import {
  Button,
  ControlledInput,
  ControlledSelect,
  Image,
  Text,
  View,
} from '@/components/ui';
import { useUnitStore } from '@/lib/store/units';

import { CheckRound, ImagePlus, Trash } from '../ui/icons';

const unitTypes = [
  { label: 'Office', value: 'office' },
  { label: 'Shop', value: 'shop' },
  { label: 'Room', value: 'room' },
];

const schema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  unit_type: z.string().min(1, 'Unit type is required'),
  area: z.number().min(1, 'Area is required'),
  monthly_rent: z.number().min(1, 'Monthly rent is required'),
  description: z.string().optional(),
  has_washroom: z.boolean(),
  has_air_conditioning: z.boolean(),
  has_internet: z.boolean(),
  is_occupied: z.boolean(),
});

export type UnitFormType = z.infer<typeof schema>;

interface UnitFormProps {
  onSaveSubmit: (data: UnitFormType) => void;
  onSubmitImage: (data: { image: any }) => void;
  onSubmitDeleteImage: (imageId: number) => void;
  isLoading: boolean;
  defaultValues?: Partial<UnitFormType>;
}

export const UnitForm: React.FC<UnitFormProps> = ({
  onSaveSubmit,
  onSubmitImage,
  onSubmitDeleteImage,
  isLoading,
  defaultValues = {},
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UnitFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { colorScheme } = useColorScheme();
  const editImages = useUnitStore.use.editImages();
  const [images, setImages] = useState<any[]>([]);
  const editUnit = useUnitStore.use.editUnit();
  const removeLatestUpload = useUnitStore.use.removeLatestUpload();
  // const router = useRouter();

  useEffect(() => {
    setValue('is_occupied', false);

    if (editUnit) {
      setValue('name', editUnit.name);
      setValue('unit_type', editUnit.unit_type);
      setValue('area', editUnit.area);
      setValue('monthly_rent', editUnit.monthly_rent);
      setValue('description', editUnit.description);
      setValue('has_washroom', editUnit.has_washroom);
      setValue('has_air_conditioning', editUnit.has_air_conditioning);
      setValue('has_internet', editUnit.has_internet);
      setValue('is_occupied', editUnit.is_occupied);
    }
  }, [editUnit, setValue]);
  useEffect(() => {
    if (removeLatestUpload) {
      setImages((prev) => prev.slice(0, -1));
    }
  }, [removeLatestUpload]);

  const renderInput = (
    name: keyof UnitFormType,
    label: string,
    placeholder: string,
    keyboardType?: 'numeric' | 'default',
    multiline = false,
    numberOfLines = 1
  ): JSX.Element => {
    return (
      <View className="mb-4">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <ControlledInput
              control={control}
              name={name}
              label={label}
              value={value?.toString() || ''}
              onChangeText={onChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
              error={errors[name]?.message}
            />
          )}
        />
      </View>
    );
  };

  const renderNumericInput = (
    name: keyof UnitFormType,
    label: string,
    placeholder: string
  ): JSX.Element => {
    return (
      <View className="mb-4">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <ControlledInput
              control={control}
              name={name}
              label={label}
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(Number(text))}
              placeholder={placeholder}
              keyboardType="numeric"
              error={errors[name]?.message}
            />
          )}
        />
      </View>
    );
  };

  const renderToggle = (
    name: keyof UnitFormType,
    label: string,
    bgColor: string
  ): JSX.Element => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Button
            icon={
              value ? (
                <CheckRound width={16} height={16} color={bgColor} />
              ) : undefined
            }
            onPress={() => onChange(!value)}
            textClassName={value ? `text-${bgColor}-800` : ''}
            className={`flex-1 rounded-full ${value ? `bg-${bgColor}-100 dark:bg-${bgColor}-200` : ''}`}
            label={label}
          />
        )}
      />
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0]]);
      onSubmitImage({ image: result.assets[0] });
    }
  };

  return (
    <View className="flex-1">
      {renderInput('name', 'Unit Name', 'Enter unit name')}

      <View className="mb-4">
        <Controller
          name="unit_type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ControlledSelect
              control={control}
              name="unit_type"
              label="Unit Type"
              value={value}
              onSelect={onChange}
              options={unitTypes.map((type) => ({
                label: type.label,
                value: type.value,
              }))}
              error={errors.unit_type?.message}
            />
          )}
        />
      </View>

      {renderNumericInput('area', 'Area (sq.ft)', 'Enter area in square feet')}
      {renderNumericInput('monthly_rent', 'Monthly Rent', 'Enter monthly rent')}

      {renderInput(
        'description',
        'Description',
        'Enter unit description',
        'default',
        true,
        4
      )}

      <View className="mb-4 flex-row justify-between gap-4">
        {renderToggle('has_washroom', 'Washroom', 'green')}
        {renderToggle('has_air_conditioning', 'AC', 'blue')}
        {renderToggle('has_internet', 'Internet', 'purple')}
      </View>

      <Button
        onPress={() => handleSubmit((data) => onSaveSubmit(data))()}
        loading={isLoading}
        label="Save"
      />

      {editUnit && (
        <View className="mt-5 flex-col gap-2">
          <Divider
            theme={{
              colors: {
                primary: colorScheme === 'dark' ? '#000000' : '#ffffff',
              },
            }}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Unit Images</Text>
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
                  onPress={() => pickImage()}
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
                onPress={() => pickImage()}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
