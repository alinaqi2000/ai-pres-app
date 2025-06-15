import { type PropertyReference } from './property';
import { type Unit } from './unit';

export type FloorReference = {
  id: number;
  number: number;
  name: string;
};

export type Floor = {
  id: number;
  number: number;
  name: string;
  property: PropertyReference;
  units: Unit[];
  created_at: string;
};
