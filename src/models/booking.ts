import { type FloorReference } from './floor';
import { type Owner, type PropertyReference } from './property';
import { type TenantRequestReference } from './tenant-request';
import { type UnitReference } from './unit';

export type Tenant = {
  id: number;
  name: string;
  email: string;
  city: string;
};

type BookingStatus = 'active' | 'closed';

export class Booking {
  // eslint-disable-next-line max-params
  constructor(
    public id: number,
    public tenant_request: TenantRequestReference | null,
    public tenant: Tenant | null,
    public owner: Owner | null,
    public property: PropertyReference | null,
    public floor: FloorReference | null,
    public unit: UnitReference | null,
    public booked_by_owner: boolean,
    public status: BookingStatus,
    public created_at: string,
    public start_date: string,
    public total_price: number,
    public notes: string,
    public end_date: string,
    public updated_at: string
  ) { }
}
