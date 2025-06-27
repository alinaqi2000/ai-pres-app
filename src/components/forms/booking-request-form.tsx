import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { z } from 'zod';

import { Button, ControlledInput, Select, View } from '@/components/ui';
import { toTitleCase } from '@/lib';
import { useBookingStore } from '@/lib/store/bookings';
import { usePropertyStore } from '@/lib/store/my-properties';
import { type UnitReference } from '@/models';
import { type Item } from '@/models/item';
import { type PropertyReference } from '@/models/property';

const schema = z.object({
  tenant_id: z.number().optional(),
  property_id: z.number().optional(),
  floor_id: z.number().optional(),
  unit_id: z.number().optional(),
  start_date: z.string().default(new Date().toISOString()),
  monthly_offer: z.coerce.number(),
  message: z.string().optional(),
});

export type BookingRequestFormType = z.infer<typeof schema>;

export type BookingRequestFormProps = {
  onSaveSubmit: (data: BookingRequestFormType, moveNext?: boolean) => void;
  isLoading: boolean;
  defaultValues?: Partial<BookingRequestFormType>;
};

export const BookingRequestForm = ({
  onSaveSubmit,
  isLoading,
  defaultValues = {},
}: BookingRequestFormProps) => {
  const { handleSubmit, control, setValue, watch } =
    useForm<BookingRequestFormType>({
      resolver: zodResolver(schema),
      defaultValues,
    });
  const currentProperty = usePropertyStore.use.currentProperty();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const items: Item[] = useMemo(() => {
    const preparedItems: Item[] = [];
    preparedItems.push({
      type: 'property',
      item: {
        id: currentProperty?.id || 0,
        property_id: currentProperty?.property_id || '',
        name: currentProperty?.name || '',
        city: currentProperty?.city || '',
        property_type: currentProperty?.property_type || '',
        monthly_rent: currentProperty?.monthly_rent || 0,
        is_occupied: currentProperty?.is_occupied || false,
        address: currentProperty?.address || '',
      } as PropertyReference,
    });

    currentProperty?.floors?.forEach((floor) => {
      floor.units?.forEach((unit) => {
        preparedItems.push({
          type: 'unit',
          item: {
            id: unit.id,
            name: unit.name,
            unit_type: unit.unit_type,
            area: unit.area,
            monthly_rent: unit.monthly_rent,
            is_occupied: unit.is_occupied,
            floor_id: floor.id,
            created_at: unit.created_at,
          } as UnitReference,
        });
      });
    });

    return preparedItems;
  }, [currentProperty]);

  const optionItems = useMemo(() => {
    return items.map((i) => ({
      label:
        toTitleCase(i.type) +
        ' - ' +
        toTitleCase((i.item as UnitReference).unit_type || '') +
        toTitleCase((i.item as PropertyReference).property_type || '') +
        ' - ' +
        i.item.name +
        ' - ' +
        i.item.monthly_rent,
      value: i.type + '-' + i.item.id.toString(),
    }));
  }, [items]);

  const [openStartDate, setOpenStartDate] = useState(false);
  const currentItem = useBookingStore.use.currentItem();

  useEffect(() => {
    if (currentItem) {
      setValue('start_date', new Date().toISOString());
      setValue('monthly_offer', currentItem.item?.monthly_rent || 0);
    }
  }, [currentItem, setValue]);

  useEffect(() => {
    const [type, id] = (selectedItem as string).split('-');
    if (type === 'property') {
      setValue('monthly_offer', currentProperty?.monthly_rent || 0);
    }
    if (type === 'unit') {
      const floorItem = items.find(
        (i) => i.item.id === Number(id) && i.type === 'unit'
      );
      setValue('monthly_offer', floorItem?.item?.monthly_rent || 0);
    }
  }, [selectedItem, setValue]);

  return (
    <View className="flex-1 gap-2">
      <DatePicker
        modal
        open={openStartDate}
        date={new Date(watch('start_date') || new Date().toISOString())}
        onConfirm={(date) => {
          setOpenStartDate(false);
          setValue('start_date', date.toISOString());
        }}
        onCancel={() => {
          setOpenStartDate(false);
        }}
      />
      <ControlledInput
        name="start_date"
        value={watch('start_date')}
        label="Start Date"
        onPress={() => setOpenStartDate(true)}
        control={control}
        testID="tenant-start-date"
        formatValue={(value) =>
          value ? new Date(value).toISOString().split('T')[0] : ''
        }
      />
      <Select
        label="Item"
        value={selectedItem}
        options={optionItems}
        onSelect={(value) => {
          setSelectedItem(value as string);
          const [type, id] = (value as string).split('-');
          if (type === 'property') {
            setValue('property_id', Number(id));
          }
          if (type === 'unit') {
            const unitItem = items.find(
              (i) => i.item.id === Number(id) && i.type === 'unit'
            );
            setValue('property_id', currentProperty?.id || 0);

            setValue(
              'floor_id',
              (unitItem?.item as UnitReference).floor_id || 0
            );
            setValue('unit_id', Number(id));
          }
        }}
      />

      <ControlledInput
        name="monthly_offer"
        label="Monthly Rent"
        value={String(watch('monthly_offer') || 0)}
        control={control}
        testID="tenant-total-price"
      />
      <ControlledInput
        name="message"
        label="Message"
        numberOfLines={5}
        control={control}
        testID="tenant-message"
      />
      <Button
        label="Request"
        loading={isLoading}
        onPress={handleSubmit((data) => onSaveSubmit(data))}
      />
    </View>
  );
};
