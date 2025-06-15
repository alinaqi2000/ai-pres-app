import { type Image } from './image';

export type UnitReference = {
  id: number;
  name: string;
  unit_type: string;
  area: number;
  monthly_rent: number;
  is_occupied: boolean;
  floor_id: number;
  created_at: string;
};

export class Unit {
  // eslint-disable-next-line max-params
  constructor(
    public id: number,
    public name: string,
    public unit_type: string,
    public area: number,
    public description: string,
    public monthly_rent: number,
    public is_occupied: boolean,
    public has_washroom: boolean,
    public has_air_conditioning: boolean,
    public has_internet: boolean,
    public floor_id: number,
    public created_at: string,
    public images: Image[]
  ) { }
}
