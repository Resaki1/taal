import { Terrain } from '../../helpers/terrain';
import { BuildingType } from './Building';

export type Building = {
  type: BuildingType;
  name: string;
  icon: string;
  price: string;
  terrains: Terrain[];
};

export const allBuildings: Building[] = [
  {
    type: BuildingType.Outpost,
    name: 'Outpost',
    icon: '🗼',
    price: 'X',
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.House,
    name: 'House',
    icon: '🛖',
    price: 'x',
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.Lumberhut,
    name: 'Lumberhut',
    icon: '🪚',
    price: 'x',
    terrains: [Terrain.FOREST],
  },
  {
    type: BuildingType.CornField,
    name: 'Cornfield',
    icon: '🌽',
    price:'x',
    terrains: [Terrain.MEADOW],
  },
  {
    type: BuildingType.StoneQuarry,
    name: 'Quarry',
    icon: '⛏️',
    price: 'x',
    terrains: [Terrain.MOUNTAIN],
  },
];

export const getPossibleBuildingsForTerrain = (terrain: Terrain) =>
  allBuildings.filter((building) => building.terrains.includes(terrain));
