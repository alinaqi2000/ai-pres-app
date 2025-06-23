import { type Booking, type Tenant } from './booking';
import { type Floor } from './floor';
import { type Owner, type Property } from './property';
import { type Unit } from './unit';

export type TenantRequestReference = {
  tenant: Tenant;
  owner: Owner;
  property: Property | null;
  floor: Floor | null;
  unit: Unit | null;
  status: string;
};

export class TenantRequest {
  // eslint-disable-next-line max-params
  constructor(
    public id: number,
    public tenant: Tenant,
    public owner: Owner,
    public status: string,
    public type: 'cancellation' | 'booking' | 'maintenance',
    public is_seen: boolean,
    public created_at: string,
    public message: string | null,
    public updated_at: string | null,
    public property: Property | null,
    public booking: Booking | null,
    public floor: Floor | null,
    public unit: Unit | null
  ) { }
}
