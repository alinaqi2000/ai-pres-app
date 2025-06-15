import { type Tenant } from './booking';
import { type Floor } from './floor';
import { type Owner, type Property } from './property';
import { type Unit } from './unit';

export type TenantRequestReference = {
  tenant: Tenant;
  owner: Owner;
  property: Property;
  floor: Floor;
  unit: Unit;
  status: string;
};

export class TenantRequest {
  constructor(
    public id: number,
    public tenant: Tenant,
    public owner: Owner,
    public property: Property,
    public floor: Floor,
    public unit: Unit,
    public status: string,
    public is_seen: boolean,
    public created_at: string,
    public updated_at: string | null
  ) { }
}
