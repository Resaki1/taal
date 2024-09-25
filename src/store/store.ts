import { Object3D, Event, Vector3 } from 'three';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { BuildingType } from '../components/Building/Building';
import { BuildingSellBenefits } from '../components/Building/buildingFinancials';
import { getCostsOfBuilding, getOutputOfBuilding } from '../components/Building/buildings';

export type Ressources = 'wood' | 'stone' | 'gold' | 'food' | 'villager';

interface BuildingTypeState {
  [key: number]: { [key: number]: BuildingType };
}

interface SelectedObject {
  type: string;
  object: Object3D<Event>;
}

export type State = {
  buildings: BuildingTypeState;
  buildingOutputs: { [key in Ressources]: number };
  ressources: {
    [key in Ressources]: number;
  };
  unlocked: { [key: number]: { [key: number]: number } };
  selected: SelectedObject | undefined;
  locations: { [key: string]: { positionX: number; positionY: number } };
  camera:
    | {
        position: Vector3;
        lookAt: Vector3;
      }
    | undefined;
};

export type Actions = {
  addBuilding: (x: number, y: number, building: BuildingType) => void;
  removeBuilding: (x: number, y: number) => void;
  addRessources: (ressourcesToAdd: Partial<{ [key in Ressources]: number }>) => void;
  removeRessources: (ressourcesToRemove: Partial<{ [key in Ressources]: number }>) => void;
  lock: (x: number, y: number, range: number) => void;
  unlock: (x: number, y: number, range: number) => void;
  setSelected: (object: SelectedObject | undefined) => void;
  saveLocation: (title: string, x: number, y: number) => void;
  removeLocation: (title: string) => void;
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
  locations: {},
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
            const costs = getCostsOfBuilding(building);
            const ressourcesToRemove = Object.fromEntries(
              Object.entries(costs).map(([key, value]) => [key, value.amount])
            );
            state.removeRessources(ressourcesToRemove);

            if (building === BuildingType.Outpost) {
              state.unlock(x, y, 8);
            }

            // add building output
            const newBuildingOutputs =state.buildingOutputs;
            const output = getOutputOfBuilding(building);
            Object.entries(output).forEach(([key, value]) => {
              newBuildingOutputs[key as Ressources] += value.amount;
            });

            // add new building
            const newBuildingType = state.buildings;
            if (!newBuildingType[x]) newBuildingType[x] = {};
            newBuildingType[x][y] = building;

            return {
              buildings: newBuildingType,
              buildingOutputs: newBuildingOutputs,
            };
          }),
        // add new saved location
        saveLocation: (t, x, y) =>
          set((state) => {
            const newLocationType = state.locations;
            newLocationType[t] = { positionX: x, positionY: y };
            return {
              locations: newLocationType,
            };
          }),
        // remove saved location
        removeLocation: (t) =>
          set((state) => {
            const newLocationType = state.locations;
            delete newLocationType[t];
            return {
              locations: newLocationType,
            };
          }),
        removeBuilding: (x, y) =>
          set((state) => {
            const building = state.buildings[x][y];
            const sellBenefits = BuildingSellBenefits[building];
            const ressourcesToAdd = Object.fromEntries(
              Object.entries(sellBenefits).map(([key, value]) => [key, value])
            );
            state.addRessources(ressourcesToAdd);

            if (building === BuildingType.Outpost) {
              state.lock(x, y, 8);
            }

            // remove building output
            const newBuildingOutputs = state.buildingOutputs;
            const output = getOutputOfBuilding(building);
            Object.entries(output).forEach(([key, value]) => {
              newBuildingOutputs[key as Ressources] -= value.amount;
            });

            const newBuildingType = { ...state.buildings };
            delete newBuildingType[x][y];
            return { buildings: newBuildingType, buildingOutputs: newBuildingOutputs };
          }),
        addRessources: (ressourcesToAdd: Partial<{ [key in Ressources]: number }>) =>
          set((state: State) => {
            const newRessources = state.ressources;
            Object.entries(ressourcesToAdd).forEach(([key, value]) => {
              newRessources[key as Ressources] += value!;
            });
            return {
              ressources: newRessources,
            };
          }),
        removeRessources: (ressourcesToRemove: Partial<{ [key in Ressources]: number }>) =>
          set((state: State) => {
            const newRessources = state.ressources ;
            Object.entries(ressourcesToRemove).forEach(([key, value]) => {
              newRessources[key as Ressources] -= value!;
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
                  newUnlocked[i][j] -= 1;
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
                  if (!newUnlocked[i][j]) newUnlocked[i][j] = 1;
                  else newUnlocked[i][j] += 1;
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
        reset: () => set(initialState),
      }),
      {
        name: 'game-state',
      },
    ),
  ),
);