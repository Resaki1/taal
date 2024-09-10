import { Terrain } from '../../helpers/terrain';
import { Ressources } from '../../store/store';
import { BuildingType } from './Building';

export type Building = {
  type: BuildingType;
  name: string;
  icon: string;
  description: string;
  costs: {
    // how much of each ressource is consumed when placing the building
    [key in Ressources]?: number;
  };
  output: {
    // use negative values for costs (i.e. output 'gold: -10 / 60' means the building costs 10 gold per minute)
    [key in Ressources]?: number;
  };
  terrains: Terrain[]; // the types of terrain the building can be built on
};

// New buildings can be introduced simply by adding them to this list
// For performance reasons, move less used buildings to the end of the list
export const allBuildings: Building[] = [
  {
    type: BuildingType.Outpost,
    name: 'Outpost',
    icon: '🗼',
    description: 'The Outpost serves as a beacon of expansion, allowing your town to extend its borders and explore new territories. It stands tall, symbolizing the ambition and growth of your community. Establishing an Outpost is the first step towards a thriving and expansive settlement.',
    costs: {
      wood: 10,
      gold: 600,
    },
    output: {
      gold: -20 / 60,
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.House,
    name: 'House',
    icon: '🛖',
    description: 'A cozy House that provides shelter for your villagers, adding 4 new members to your growing town. These villagers contribute to the economy by paying taxes, but they also require sustenance. The House is a cornerstone of any thriving community, ensuring the well-being and growth of its inhabitants.',
    costs: {
      wood: 6,
      gold: 100,
      villager: -4,
    },
    output: {
      gold: 12 / 60,
      food: -1 / 60,
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.Lumberhut,
    name: 'Lumberhut',
    icon: '🪚',
    description: 'The Lumberhut is a vital structure where a villager works tirelessly to produce the wood necessary for constructing new buildings. Though it requires gold to maintain, the steady supply of wood it provides is indispensable for the expansion and development of your town.',
    costs: {
      wood: 2,
      gold: 10,
      villager: 1,
    },
    output: {
      wood: 2 / 60,
      gold: -6 / 60,
    },
    terrains: [Terrain.FOREST],
  },
  {
    type: BuildingType.CornField,
    name: 'Cornfield',
    icon: '🌽',
    description: 'The Cornfield is a humble yet essential source of food for your villagers. While it incurs maintenance costs, the Cornfield ensures a steady supply of nourishment, supporting the health and productivity of your community. It is a testament to the agricultural prowess of your town.',
    costs: {
      gold: 30,
    },
    output: {
      gold: -8 / 60,
      food: 4 / 60,
    },
    terrains: [Terrain.MEADOW],
  },
  {
    type: BuildingType.StoneQuarry,
    name: 'Quarry',
    icon: '⛏️',
    description:
      'The Quarry is a bustling hub where villagers extract stone, a crucial resource for constructing advanced buildings. Despite the costs associated with its operation, the Quarry plays a key role in the architectural and infrastructural advancements of your settlement, paving the way for future growth.',
    costs: {
      wood: 6,
      gold: 40,
      villager: 4,
    },
    output: {
      gold: -12 / 60,
      stone: 2 / 60,
    },
    terrains: [Terrain.MOUNTAIN],
  },
];

export const getBuildingByType = (type: BuildingType) => allBuildings.find((building) => building.type === type);

export const getPossibleBuildingsForTerrain = (terrain: Terrain) =>
  allBuildings.filter((building) => building.terrains.includes(terrain));

export const getCostsOfBuilding = (buildingType: BuildingType) =>
  allBuildings.find((building) => building.type === buildingType)!.costs;

export const getOutputOfBuilding = (buildingType: BuildingType) =>
  allBuildings.find((building) => building.type === buildingType)!.output;
