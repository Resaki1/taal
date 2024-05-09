import { Terrain } from '../../helpers/terrain';
import { BuildingType } from './Building';

export type Building = {
  type: BuildingType;
  name: string;
  icon: string;
  costs: {
    gold?: number;
    wood?: number;
    stone?: number;
    food?: number;
    villager?: number;
  };
  terrains: Terrain[];
};

export const allBuildings: Building[] = [
  {
    type: BuildingType.Outpost,
    name: 'Outpost',
    icon: '🗼',
    costs: {
      wood: 10,
      gold: 600,
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.House,
    name: 'House',
    icon: '🛖',
    costs: {
      wood: 6,
      gold: 100,
      villager: -4,
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.Lumberhut,
    name: 'Lumberhut',
    icon: '🪚',
    costs: {
      wood: 2,
      gold: 10,
      villager: 1,
    },
    terrains: [Terrain.FOREST],
  },
  {
    type: BuildingType.CornField,
    name: 'Cornfield',
    icon: '🌽',
    costs: {
      gold: 30,
    },
    terrains: [Terrain.MEADOW],
  },
  {
    type: BuildingType.StoneQuarry,
    name: 'Quarry',
    icon: '⛏️',
    costs: {
      wood: 6,
      gold: 40,
      villager: 4,
    },
    terrains: [Terrain.MOUNTAIN],
  },
];

export const getPossibleBuildingsForTerrain = (terrain: Terrain) =>
  allBuildings.filter((building) => building.terrains.includes(terrain));

export const getCostsOfBuilding = (buildingType: BuildingType) =>
  allBuildings.find((building) => building.type === buildingType)!.costs;
