import { Object3D, Event } from "three";
import create from "zustand";
import { persist } from "zustand/middleware";
import { Buildings } from "../components/Building/Building";

interface BuildingsState {
  [key: number]: { [key: number]: Buildings };
}

interface SelectedObject {
  type: string;
  object: Object3D<Event>;
}

interface State {
  buildings: BuildingsState;
  addBuilding: (x: number, y: number, building: Buildings) => void;
  removeBuilding: (x: number, y: number) => void;
  selected: SelectedObject | undefined;
  setSelected: (object: SelectedObject | undefined) => void;
}

export const useStore = create<State>()(
  /* persist( */ (set) => ({
    buildings: {},
    addBuilding: (x, y, building) =>
      set((state: State) => {
        const newBuildings = state.buildings;
        if (!newBuildings[x]) newBuildings[x] = {};
        newBuildings[x][y] = building;
        return { buildings: newBuildings };
      }),
    removeBuilding: (x, y) =>
      set((state: State) => {
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
