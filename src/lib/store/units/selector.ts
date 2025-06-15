import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { type Floor, type Image } from '@/models';
import { type Unit } from '@/models/unit';

interface UnitState {
  editFloor: Floor | null;
  editUnit: Unit | null;
  removeLatestUpload: boolean;
  editImages: Image[];
  setEditUnit: (unit: Unit | null) => void;
  setEditFloor: (floor: Floor | null) => void;
  setEditImages: (images: Image[]) => void;
  toggleRemoveLatestUpload: () => void;
}

const _useUnits = create<UnitState>((set, get) => ({
  editUnit: null,
  editFloor: null,
  editImages: [],
  removeLatestUpload: false,
  setEditUnit: (unit: Unit | null) => {
    set({ editUnit: unit });
    if (unit) {
      setEditImages(unit.images || []);
    }
  },
  setEditFloor: (floor: Floor | null) => {
    set({ editFloor: floor });
  },
  setEditImages: (images: Image[]) => {
    const editUnit = get().editUnit;
    if (editUnit) {
      editUnit.images = images;
    }
    set({ editImages: images, editUnit });
  },
  toggleRemoveLatestUpload: () => {
    set({ removeLatestUpload: !get().removeLatestUpload });
  },
}));

export const useUnitStore = createSelectors(_useUnits);

export const setEditUnit = (unit: Unit | null) =>
  _useUnits.getState().setEditUnit(unit);

export const setEditImages = (images: Image[]) =>
  _useUnits.getState().setEditImages(images);

export const setEditFloor = (floor: Floor | null) =>
  _useUnits.getState().setEditFloor(floor);

export const toggleRemoveLatestUpload = () =>
  _useUnits.getState().toggleRemoveLatestUpload();
