import { type Booking, type Tenant } from './booking';
import { type Owner } from './property';

type InvoiceLineItem = {
  id: number;
  description: string;
  amount: number;
};

export type MinInvoice = {
  id: number;
  reference_number: string;
  month: string;
  status: 'overdue' | 'paid';
  amount: number;
  due_date: string;
};

export class Invoice {
  constructor(
    public id: number,
    public reference_number: string,
    public month: string,
    public status: 'overdue' | 'paid',
    public tenant: Tenant | null,
    public owner: Owner | null,
    public booking: Booking,
    public line_items: InvoiceLineItem[] = [],
    public amount: number,
    public created_at: string
  ) { }
}
