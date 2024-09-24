import { Terrain } from '../../helpers/terrain';
import { Ressources } from '../../store/store';
import { BuildingType } from './Building';

const EMOJIS = {
  wood: '🪵',
  gold: '💰',
  villager: '🧑‍🦱',
  food: '🍟',
  stone: '🪨',
};

export type Building = {
  type: BuildingType;
  name: string;
  icon: string;
  description: string;
  costs: {
    // how much of each ressource is consumed when placing the building
    [key in Ressources]?: {
      amount: number;
      emoji: string;
    };
  };
  output: {
    // use negative values for costs (i.e. output 'gold: -10 / 60' means the building costs 10 gold per minute)
    [key in Ressources]?: {
      amount: number;
      emoji: string;
    };
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
      wood: { amount: 10, emoji: EMOJIS.wood },
      gold: { amount: 600, emoji: EMOJIS.gold },
    },
    output: {
      gold: { amount: -20 / 60, emoji: EMOJIS.gold },
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.House,
    name: 'House',
    icon: '🛖',
    description: 'A cozy House that provides shelter for your villagers, adding 4 new members to your growing town. These villagers contribute to the economy by paying taxes, but they also require sustenance. The House is a cornerstone of any thriving community, ensuring the well-being and growth of its inhabitants.',
    costs: {
      wood: { amount: 6, emoji: EMOJIS.wood },
      gold: { amount: 100, emoji: EMOJIS.gold },
      villager: { amount: -4, emoji: EMOJIS.villager },
    },
    output: {
      gold: { amount: 12 / 60, emoji: EMOJIS.gold },
      food: { amount: -1 / 60, emoji: EMOJIS.food },
    },
    terrains: [Terrain.BEACH, Terrain.MEADOW, Terrain.FOREST],
  },
  {
    type: BuildingType.Lumberhut,
    name: 'Lumberhut',
    icon: '🪚',
    description: 'The Lumberhut is a vital structure where a villager works tirelessly to produce the wood necessary for constructing new buildings. Though it requires gold to maintain, the steady supply of wood it provides is indispensable for the expansion and development of your town.',
    costs: {
      wood: { amount: 2, emoji: EMOJIS.wood },
      gold: { amount: 10, emoji: EMOJIS.gold },
      villager: { amount: 1, emoji: EMOJIS.villager },
    },
    output: {
      wood: { amount: 2 / 60, emoji: EMOJIS.wood },
      gold: { amount: -6 / 60, emoji: EMOJIS.gold },
    },
    terrains: [Terrain.FOREST],
  },
  {
    type: BuildingType.CornField,
    name: 'Cornfield',
    icon: '🌽',
    description: 'The Cornfield is a humble yet essential source of food for your villagers. While it incurs maintenance costs, the Cornfield ensures a steady supply of nourishment, supporting the health and productivity of your community. It is a testament to the agricultural prowess of your town.',
    costs: {
      gold: { amount: 30, emoji: EMOJIS.gold },
    },
    output: {
      gold: { amount: -8 / 60, emoji: EMOJIS.gold },
      food: { amount: 4 / 60, emoji: EMOJIS.food },
    },
    terrains: [Terrain.MEADOW],
  },
  {
    type: BuildingType.StoneQuarry,
    name: 'Quarry',
    icon: '⛏️',
    description: 'The Quarry is a bustling hub where villagers extract stone, a crucial resource for constructing advanced buildings. Despite the costs associated with its operation, the Quarry plays a key role in the architectural and infrastructural advancements of your settlement, paving the way for future growth.',
    costs: {
      wood: { amount: 6, emoji: EMOJIS.wood },
      gold: { amount: 40, emoji: EMOJIS.gold },
      villager: { amount: 4, emoji: EMOJIS.villager },
    },
    output: {
      gold: { amount: -12 / 60, emoji: EMOJIS.gold },
      stone: { amount: 2 / 60, emoji: EMOJIS.stone },
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