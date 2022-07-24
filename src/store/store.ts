import { Object3D, Event } from "three";
import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import {
  Buildings,
  BuildingCosts,
  BuildingOutputs,
} from "../components/Building/Building";

export type Ressources = "wood" | "stone" | "gold" | "villager";

interface BuildingsState {
  [key: number]: { [key: number]: Buildings };
}

interface SelectedObject {
  type: string;
  object: Object3D<Event>;
}

type State = {
  buildings: BuildingsState;
  buildingOutputs: { [key in Ressources]: number };
  selected: SelectedObject | undefined;
  ressources: {
    [key in Ressources]: number;
  };
};

type Actions = {
  addBuilding: (x: number, y: number, building: Buildings) => void;
  removeBuilding: (x: number, y: number) => void;
  setSelected: (object: SelectedObject | undefined) => void;
  addRessources: (
    ressourcesToAdd: Partial<{ [key in Ressources]: number }>
  ) => void;
  removeRessources: (
    ressourcesToRemove: Partial<{ [key in Ressources]: number }>
  ) => void;
  reset: () => void;
};

const initialState: State = {
  buildings: {},
  buildingOutputs: {
    wood: 0,
    stone: 0,
    gold: 0,
    villager: 0,
  },
  selected: undefined,
  ressources: {
    wood: 15,
    stone: 0,
    gold: 2000,
    villager: 2,
  },
};

export const useStore = create<State & Actions>()(
  devtools(
    persist((set, get) => ({
      ...initialState,
      addBuilding: (x, y, building) =>
        set((state) => {
          state.removeRessources(BuildingCosts[building]);

          const newBuildings = state.buildings;
          if (!newBuildings[x]) newBuildings[x] = {};
          newBuildings[x][y] = building;

          const newBuildingOutputs = state.buildingOutputs;
          Object.entries(BuildingOutputs[building]).forEach((ressource) => {
            newBuildingOutputs[ressource[0] as Ressources] += ressource[1];
          });

          return {
            buildings: newBuildings,
            buildingOutputs: newBuildingOutputs,
          };
        }),
      removeBuilding: (x, y) =>
        set((state: State) => {
          // TODO: remove output froom state.buildingOutputs
          const newBuildingOutputs = state.buildingOutputs;
          const building = state.buildings[x][y];
          Object.entries(BuildingOutputs[building]).forEach((ressource) => {
            newBuildingOutputs[ressource[0] as Ressources] -= ressource[1];
          });

          const newBuildings = state.buildings;
          delete newBuildings[x][y];
          return { buildings: newBuildings };
        }),
      setSelected: (object) =>
        set(() => {
          return { selected: object };
        }),
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
      reset: () => set({ ...initialState }),
    }))
  )
);
