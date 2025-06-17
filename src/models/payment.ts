import { type Tenant } from './booking';
import { type MinInvoice } from './invoice';
import { type Owner } from './property';

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
    public created_at: string,
    public owner?: Owner,
    public tenant?: Tenant,
    public payment_method?: PaymentMethod,
    public updated_at?: string
  ) { }
}
