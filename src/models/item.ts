import { type PropertyReference } from './property';
import { type UnitReference } from './unit';

export type Item = {
  type: 'property' | 'unit';
  item: PropertyReference | UnitReference;
};
