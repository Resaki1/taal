import create from "zustand";
import { persist } from "zustand/middleware";

interface Buildings {
  [key: number]: { [key: number]: string };
}
interface BearState {
  buildings: Buildings;
  addBuilding: (x: number, y: number, building: string) => void;
}

export const useStore = create<BearState>()(
  persist((set) => ({
    buildings: {},
    addBuilding: (x, y, building) =>
      set((state: BearState) => {
        const newBuildings = state.buildings;
        if (!newBuildings[x]) newBuildings[x] = {};
        newBuildings[x][y] = building;
        return { buildings: newBuildings };
      }),
  }))
);
