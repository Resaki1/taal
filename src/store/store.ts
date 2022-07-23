import { Object3D, Event } from "three";
import create from "zustand";
import { persist } from "zustand/middleware";
import {
  Buildings,
  BuildingCosts,
  BuildingOutputs,
} from "../components/Building/Building";

export type Ressources = "wood" | "stone" | "gold";

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
  ressources: {
    [key in Ressources]: number;
  };
  addRessources: (
    ressourcesToAdd: Partial<{ [key in Ressources]: number }>
  ) => void;
  removeRessources: (
    ressourcesToRemove: Partial<{ [key in Ressources]: number }>
  ) => void;
}

export const useStore = create<State>()(
  /* persist( */ (set) => ({
    buildings: {},
    addBuilding: (x, y, building) =>
      set((state: State) => {
        state.removeRessources(BuildingCosts[building]);

        const interval = setInterval(() => {
          state.addRessources(BuildingOutputs[building]);
        }, 1000);

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
    ressources: {
      wood: 5,
      stone: 0,
      gold: 0,
    },
    addRessources: (
      ressourcesToAdd: Partial<{ [key in Ressources]: number }>
    ) =>
      set((state: State) => {
        const newRessources = state.ressources;
        Object.entries(ressourcesToAdd).forEach((ressource) => {
          newRessources[ressource[0] as Ressources] += ressource[1];
        });
        return {
          ressources: newRessources,
        };
      }),
    removeRessources: (
      ressourcesToRemove: Partial<{ [key in Ressources]: number }>
    ) =>
      set((state: State) => {
        const newRessources = state.ressources;
        Object.entries(ressourcesToRemove).forEach((ressource) => {
          newRessources[ressource[0] as Ressources] -= ressource[1];
        });
        return {
          ressources: newRessources,
        };
      }),
  })
);
/* ); */
