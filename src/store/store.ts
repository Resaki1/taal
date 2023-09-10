import { Object3D, Event, Vector3 } from 'three';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Buildings } from '../components/Building/Building';
import { BuildingCosts, BuildingOutputs, BuildingSellBenefits } from '../components/Building/buildingFinancials';

export type Ressources = 'wood' | 'stone' | 'gold' | 'food' | 'villager';

interface BuildingsState {
  [key: number]: { [key: number]: Buildings };
}

interface SelectedObject {
  type: string;
  object: Object3D<Event>;
}

export type State = {
  buildings: BuildingsState;
  buildingOutputs: { [key in Ressources]: number };
  ressources: {
    [key in Ressources]: number;
  };
  unlocked: { [key: number]: { [key: number]: boolean } };
  selected: SelectedObject | undefined;
  camera:
    | {
        position: Vector3;
        lookAt: Vector3;
      }
    | undefined;
};

export type Actions = {
  addBuilding: (x: number, y: number, building: Buildings) => void;
  removeBuilding: (x: number, y: number) => void;
  addRessources: (ressourcesToAdd: Partial<{ [key in Ressources]: number }>) => void;
  removeRessources: (ressourcesToRemove: Partial<{ [key in Ressources]: number }>) => void;
  lock: (x: number, y: number, range: number) => void;
  unlock: (x: number, y: number, range: number) => void;
  setSelected: (object: SelectedObject | undefined) => void;
  setCamera: (position: Vector3, lookAt: Vector3) => void;
  reset: () => void;
};

const initialState: State = {
  buildings: {},
  buildingOutputs: {
    wood: 0,
    stone: 0,
    gold: 0,
    food: 0,
    villager: 0,
  },
  ressources: {
    wood: 15,
    stone: 0,
    gold: 2000,
    food: 20,
    villager: 2,
  },
  unlocked: {},
  selected: undefined,
  camera: undefined,
};

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        addBuilding: (x, y, building) =>
          set((state) => {
            state.removeRessources(BuildingCosts[building]);

            if (building === Buildings.Outpost) {
              state.unlock(x, y, 8);
            }

            // add building output
            const newBuildingOutputs = state.buildingOutputs;
            Object.entries(BuildingOutputs[building]).forEach((ressource) => {
              newBuildingOutputs[ressource[0] as Ressources] += ressource[1];
            });

            // add new building
            const newBuildings = state.buildings;
            if (!newBuildings[x]) newBuildings[x] = {};
            newBuildings[x][y] = building;

            return {
              buildings: newBuildings,
              buildingOutputs: newBuildingOutputs,
            };
          }),
        removeBuilding: (x, y) =>
          set((state) => {
            const building = state.buildings[x][y];
            state.addRessources(BuildingSellBenefits[state.buildings[x][y]]);

            if (building === Buildings.Outpost) {
              state.lock(x, y, 8);
            }

            // TODO: remove output froom state.buildingOutputs
            const newBuildingOutputs = state.buildingOutputs;
            Object.entries(BuildingOutputs[building]).forEach((ressource) => {
              newBuildingOutputs[ressource[0] as Ressources] -= ressource[1];
            });

            const newBuildings = state.buildings;
            delete newBuildings[x][y];
            return { buildings: newBuildings };
          }),
        addRessources: (ressourcesToAdd: Partial<{ [key in Ressources]: number }>) =>
          set((state: State) => {
            const newRessources = state.ressources;
            Object.entries(ressourcesToAdd).forEach((ressource) => {
              newRessources[ressource[0] as Ressources] += ressource[1];
            });
            return {
              ressources: newRessources,
            };
          }),
        removeRessources: (ressourcesToRemove: Partial<{ [key in Ressources]: number }>) =>
          set((state: State) => {
            const newRessources = state.ressources;
            Object.entries(ressourcesToRemove).forEach((ressource) => {
              newRessources[ressource[0] as Ressources] -= ressource[1];
            });
            return {
              ressources: newRessources,
            };
          }),
        lock: (x, y, range) =>
          set((state: State) => {
            const newUnlocked = state.unlocked;
            let distance: number;
            for (let i = x - range; i <= x + range; i++) {
              for (let j = y - range; j <= y + range; j++) {
                distance = Math.sqrt(Math.pow(x - i, 2) + Math.pow(y - j, 2));
                if (distance < range) {
                  if (!newUnlocked[i]) newUnlocked[i] = {};
                  newUnlocked[i][j] = false;
                }
              }
            }
            return {
              unlocked: newUnlocked,
            };
          }),
        unlock: (x, y, range) =>
          set((state: State) => {
            const newUnlocked = state.unlocked;
            let distance: number;
            for (let i = x - range; i <= x + range; i++) {
              for (let j = y - range; j <= y + range; j++) {
                distance = Math.sqrt(Math.pow(x - i, 2) + Math.pow(y - j, 2));
                if (distance < range) {
                  if (!newUnlocked[i]) newUnlocked[i] = {};
                  newUnlocked[i][j] = true;
                }
              }
            }
            return {
              unlocked: newUnlocked,
            };
          }),
        setSelected: (object) =>
          set(() => {
            return { selected: object };
          }),
        setCamera: (position, lookAt) =>
          set(() => {
            return { camera: { position, lookAt } };
          }),
        reset: () => set({ ...initialState }),
      }),
      {
        name: 'game-state',
      },
    ),
  ),
);
