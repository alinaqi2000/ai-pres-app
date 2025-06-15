import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { z } from 'zod';

import { Button, ControlledInput, View } from '@/components/ui';
import { useBookingStore } from '@/lib/store/bookings';

const schema = z.object({
  tenant_id: z.number().optional(),
  property_id: z.number().optional(),
  unit_id: z.number().optional(),
  start_date: z.string().default(new Date().toISOString()),
  end_date: z.string().optional(),
  total_price: z.coerce.number(),
  notes: z.string().optional(),
});

export type BookingFormType = z.infer<typeof schema>;

export type BookingFormProps = {
  onSaveSubmit: (data: BookingFormType, moveNext?: boolean) => void;
  isLoading: boolean;
  defaultValues?: Partial<BookingFormType>;
};

export const BookingForm = ({
  onSaveSubmit,
  isLoading,
  defaultValues = {},
}: BookingFormProps) => {
  const { handleSubmit, control, setValue, watch } = useForm<BookingFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [openStartDate, setOpenStartDate] = useState(false);
  const currentItem = useBookingStore.use.currentItem();
  const [openEndDate, setOpenEndDate] = useState(false);

  useEffect(() => {
    if (currentItem) {
      setValue('start_date', new Date().toISOString());
      // setValue('end_date', new Date().toISOString());
      setValue('total_price', currentItem.item?.monthly_rent || 0);
    }
  }, [currentItem, setValue]);

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
      <DatePicker
        modal
        open={openEndDate}
        minimumDate={new Date(watch('start_date') || new Date().toISOString())}
        date={new Date(watch('end_date') || new Date().toISOString())}
        onConfirm={(date) => {
          setOpenEndDate(false);
          setValue('end_date', date.toISOString());
        }}
        onCancel={() => {
          setOpenEndDate(false);
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
      <ControlledInput
        name="end_date"
        value={watch('end_date')}
        label="End Date"
        onPress={() => setOpenEndDate(true)}
        control={control}
        testID="tenant-end-date"
        formatValue={(value) =>
          value ? new Date(value).toISOString().split('T')[0] : ''
        }
      />
      <ControlledInput
        name="total_price"
        label="Monthly Rent"
        value={String(watch('total_price'))}
        control={control}
        testID="tenant-total-price"
      />
      <ControlledInput
        name="notes"
        label="Notes"
        numberOfLines={5}
        control={control}
        testID="tenant-notes"
      />
      <Button
        label="Create"
        loading={isLoading}
        onPress={handleSubmit((data) => onSaveSubmit(data))}
      />
    </View>
  );
};
