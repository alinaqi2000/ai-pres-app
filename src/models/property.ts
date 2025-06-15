import { type Floor } from './floor';
import { type Image } from './image';

export type Owner = {
  id: number;
  name: string;
  email: string;
  city: string;
};

export type PropertyReference = {
  id: number;
  property_id: string;
  name: string;
  city: string;
  address: string;
  property_type: string;
  monthly_rent?: number;
};

export class Property {
  // eslint-disable-next-line max-params
  constructor(
    public id: number,
    public property_id: string,
    public name: string,
    public city: string,
    public address: string,
    public description: string,
    public total_area: number,
    public property_type: string,
    public is_published: boolean,
    public is_occupied: boolean,
    public thumbnail: Image | null,
    public images: Image[],
    public owner: Owner,
    public created_at: string,
    public floors: Floor[],
    public monthly_rent?: number,
    public meta?: {
      total_floors: number;
      total_units: number;
      total_unoccupied_units: number;
    }
  ) { }
}
