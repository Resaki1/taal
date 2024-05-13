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
    description: 'Unlocks new areas for your town to grow.',
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
    description: 'Adds 4 villagers to your town. Villagers pay taxes but require food.',
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
    description: 'A villager works here to produce wood needed to build new buildings, but costs money to maintain.',
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
    description: 'Produces low amounts of food. Costs money to maintain.',
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
      'Villagers work here to produces stone needed for more advanced buildings, but it costs money to maintain.',
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
