import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { type Floor } from '@/models';
import { type Image } from '@/models';
import { type Property } from '@/models/property';

interface PropertyState {
  currentProperty: Property | null;
  editProperty: Property | null;
  editThumbnail: Image | null;
  editImages: Image[];
  editFloors: Floor[];
  setCurrentProperty: (property: Property | null) => void;
  setEditProperty: (property: Property | null) => void;
  setEditThumbnail: (thumbnail: Image | null) => void;
  setEditImages: (images: Image[]) => void;
  setEditFloors: (floors: Floor[]) => void;
}

const _useMyProperties = create<PropertyState>((set, get) => ({
  currentProperty: null,
  editProperty: null,
  editThumbnail: null,
  editImages: [],
  editFloors: [],
  setCurrentProperty: (property: Property | null) => {
    set({ currentProperty: property });
  },
  setEditProperty: (property: Property | null) => {
    set({ editProperty: property });
    if (property) {
      setEditThumbnail(property.thumbnail || null);
      setEditImages(property.images || []);
    }
  },
  setEditThumbnail: (thumbnail: Image | null) => {
    const editProperty = get().editProperty;
    if (editProperty) {
      editProperty.thumbnail = thumbnail;
    }
    set({ editThumbnail: thumbnail, editProperty });
  },
  setEditImages: (images: Image[]) => {
    const editProperty = get().editProperty;
    if (editProperty) {
      editProperty.images = images;
    }
    set({ editImages: images, editProperty });
  },
  setEditFloors: (floors: Floor[]) => {
    const editProperty = get().editProperty;
    if (editProperty) {
      editProperty.floors = floors;
    }
    set({ editFloors: floors, editProperty });
  },
}));

export const usePropertyStore = createSelectors(_useMyProperties);

export const setCurrentProperty = (property: Property | null) =>
  _useMyProperties.getState().setCurrentProperty(property);

export const setEditProperty = (property: Property | null) =>
  _useMyProperties.getState().setEditProperty(property);

export const setEditThumbnail = (thumbnail: Image | null) =>
  _useMyProperties.getState().setEditThumbnail(thumbnail);

export const setEditImages = (images: Image[]) =>
  _useMyProperties.getState().setEditImages(images);

export const setEditFloors = (floors: Floor[]) =>
  _useMyProperties.getState().setEditFloors(floors);
