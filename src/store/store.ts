import { Object3D, Event } from "three";
import create from "zustand";
import { persist } from "zustand/middleware";

interface Buildings {
  [key: number]: { [key: number]: string };
}

interface SelectedObject {
  type: string;
  object: Object3D<Event>;
}

interface BearState {
  buildings: Buildings;
  addBuilding: (x: number, y: number, building: string) => void;
  removeBuilding: (x: number, y: number) => void;
  selected: SelectedObject | undefined;
  setSelected: (object: SelectedObject | undefined) => void;
}

export const useStore = create<BearState>()(
  /* persist( */ (set) => ({
    buildings: {},
    addBuilding: (x, y, building) =>
      set((state: BearState) => {
        const newBuildings = state.buildings;
        if (!newBuildings[x]) newBuildings[x] = {};
        newBuildings[x][y] = building;
        return { buildings: newBuildings };
      }),
    removeBuilding: (x, y) =>
      set((state: BearState) => {
        const newBuildings = state.buildings;
        delete newBuildings[x][y];
        return { buildings: newBuildings };
      }),
    selected: undefined,
    setSelected: (object) =>
      set(() => {
        return { selected: object };
      }),
  })
);
/* ); */
