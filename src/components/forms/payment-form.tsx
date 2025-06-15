import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, ControlledInput, Select, View } from '@/components/ui';
import { useInvoiceStore } from '@/lib/store/invoices';
import { type PaymentMethod } from '@/models/payment';

const schema = z.object({
  invoice_id: z.number(),
  amount: z.number(),
  payment_method_id: z.number(),
  transaction_id: z.string(),
});

export type PaymentFormType = z.infer<typeof schema>;

export type PaymentFormProps = {
  onSaveSubmit: (data: PaymentFormType, moveNext?: boolean) => void;
  isLoading: boolean;
  paymentMethods: PaymentMethod[];
};

export const PaymentForm = ({
  onSaveSubmit,
  isLoading,
  paymentMethods,
}: PaymentFormProps) => {
  const { handleSubmit, control, setValue } = useForm<PaymentFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoice_id: 0,
      amount: 0,
      payment_method_id: 0,
      transaction_id: '',
    },
  });
  const currentInvoice = useInvoiceStore.use.currentInvoice();

  const [city, setCity] = useState<string | number>('');

  useEffect(() => {
    if (currentInvoice) {
      setValue('invoice_id', currentInvoice.id);
      setValue('amount', currentInvoice.amount);
    }
  }, [currentInvoice, setValue]);

  return (
    <View className="flex-1 gap-2">
      <Select
        label="Payment Method"
        value={city}
        options={paymentMethods.map((method) => ({
          label: method.name,
          value: method.id,
        }))}
        onSelect={(value) => {
          setCity(value);
          setValue('payment_method_id', value as number);
        }}
      />
      <ControlledInput
        name="transaction_id"
        label="Transaction ID"
        control={control}
        testID="tenant-transaction-id"
      />
      <Button
        label="Save & Close"
        loading={isLoading}
        onPress={handleSubmit((data) => onSaveSubmit(data, false))}
      />
    </View>
  );
};
