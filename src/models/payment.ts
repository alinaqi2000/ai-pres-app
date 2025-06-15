import { type MinInvoice } from './invoice';

export class PaymentMethod {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public key: string,
    public status: string,
    public category: string
  ) { }
}

export class Payment {
  constructor(
    public id: number,
    public invoice: MinInvoice,
    public transaction_id: string,
    public status: string,
    public payment_date: string,
    public created_at: string,
    public payment_method?: PaymentMethod,
    public updated_at?: string
  ) { }
}
