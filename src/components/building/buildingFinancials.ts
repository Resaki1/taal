import { Ressources } from '../../store/store';
import { BuildingType } from './Building';
import { getCostsOfBuilding } from './buildings';

type BuildingRessourcesType = {
  [key in BuildingType]: Partial<{
    [key in Ressources]: number;
  }>;
};

const SELLFACTOR = 0.5;
export const BuildingSellBenefits: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.Outpost).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.Outpost).gold! * SELLFACTOR),
  },
  [BuildingType.Lumberhut]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.Lumberhut).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.Lumberhut).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.Lumberhut).villager!,
  },
  [BuildingType.House]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.House).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.House).villager!,
  },
  [BuildingType.CornField]: {
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
  },
  [BuildingType.StoneQuarry]: {
    wood: Math.ceil(getCostsOfBuilding(BuildingType.House).wood! * SELLFACTOR),
    gold: Math.ceil(getCostsOfBuilding(BuildingType.House).gold! * SELLFACTOR),
    villager: getCostsOfBuilding(BuildingType.House).villager!,
  },
};

// use negative values for costs (i.e. output 'gold: -10 / 60' means the building costs 10 gold per minute)
export const BuildingOutputs: BuildingRessourcesType = {
  [BuildingType.Outpost]: {
    gold: -20 / 60,
  },
  [BuildingType.Lumberhut]: {
    wood: 2 / 60,
    gold: -6 / 60,
  },
  [BuildingType.House]: {
    gold: 12 / 60,
    food: -1 / 60,
  },
  [BuildingType.CornField]: {
    gold: -8 / 60,
    food: 4 / 60,
  },
  [BuildingType.StoneQuarry]: {
    gold: -12 / 60,
    stone: 2 / 60,
  },
};
